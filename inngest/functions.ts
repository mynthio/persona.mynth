import { assert } from "superstruct";
import { inngest } from "./client";
import { GeneratePersonaEventData } from "@/schemas/generate-persona-event-data.schema";
import { creatorPrompt, imagePrompt, textPrompt } from "@/app/prompts";
import got from "got";
import { parsePersonaResponse } from "@/lib/parser";
import { TextGenerationModelFactory } from "@/lib/ai/text-generation-models/text-generation-model-factory";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";
import { TextToImgModelFactory } from "@/lib/ai/text-to-img-models/text-to-img-model.factory";
import { TextToImgModelsEnum } from "@/lib/ai/text-to-img-models/enums/text-to-img-models.enum";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { logsnag } from "@/lib/logsnag.server";
import { GeneratePersonaImageEventDataSchema } from "@/schemas/generate-persona-image-event-data.schema";
import { NonRetriableError } from "inngest";
import { realisticPortraitPrompt } from "@/lib/ai/prompts-creator/prompts-data/realistic-portrait-prompts.data";
import { animePortraitPrompt } from "@/lib/ai/prompts-creator/prompts-data/anime-portrait-prompts.data";
import { PersonaImageStyleEnum } from "@/enums/persona-image-style.enum";
import { PersonaImageQualityEnum } from "@/enums/persona-image-quality.enum";
import { PersonaImageFrameEnum } from "@/enums/persona-image-frame.enum";
import { realisticFullBodyPrompt } from "@/lib/ai/prompts-creator/prompts-data/realistic-full-body-prompts.data";
import { animeFullBodyPrompt } from "@/lib/ai/prompts-creator/prompts-data/anime-full-body-prompts.data";

export const generatePersona = inngest.createFunction(
  {
    id: "generate-persona",
    throttle: {
      limit: 4,
      period: "90s",
      key: "event.data.userId",
    },
    concurrency: {
      limit: 15, // For free plan we have 20 connections to db, so we need to be careful
    },
    retries: 1,
    onFailure: async ({ error, logger, redis, event, step }) => {
      const data = event.data.event.data;
      assert(data, GeneratePersonaEventData);

      await step.run("remove-persona-generation", async () => {
        await redis.del(
          `persona_generation:${data.promptId}:${event.data.event.id}`
        );
      });

      /**
       * Since we failed to generate persona, it would be bad to still consume
       * user tokens for generation. So we will resotre them :)
       *
       * We could do the opposite and increment consumed tokens here,
       * but we would have outdated data until generation is done, meaning
       * user could generate more than the limit very easily, especially
       * in case of bigger traffic
       */
      await step.run("restore-tokens", async () => {
        const userId = event.data.event.user.id;
        // Let's use event date if generation finished later
        const dateKey = new Date(event.data.event.ts!)
          .toISOString()
          .split("T")[0]; // e.g., "2024-07-15"
        const key = `user:${userId}:tokens:${dateKey}`;

        try {
          await redis.decrby(key, 1);
        } catch (error) {
          logger.error(error);
          // Ignore error
        }
      });
    },
  },
  { event: "app/generate-persona.sent" },
  async ({ event, step, logger, prisma, redis, runId }) => {
    const data = event.data;
    assert(data, GeneratePersonaEventData);

    const { userId, promptId, promptInput } = data;

    const { persona } = await step.run("generate-persona", async () => {
      // Update redis status first
      await redis.set(
        `persona_generation:${promptId}:${event.id}`,
        JSON.stringify({
          status: "pending",
          persona: null,
        }),
        "EX",
        5 * 60 // 5 minutes
      );

      const prompt =
        "textPrompt" in promptInput
          ? textPrompt(promptInput.textPrompt)
          : creatorPrompt(promptInput);

      let response = "";
      let model = TextGenerationModelFactory.create(
        TextGenerationModelsEnum.MetaLlama3_70bInstruct
      );

      try {
        response = await model.generateText(prompt);
      } catch (error) {
        logger.error(error);
      }

      if (!response || response.length === 0) {
        model = TextGenerationModelFactory.create(
          TextGenerationModelsEnum.MetaLlama3_8bInstruct
        );

        response = await model.generateText(prompt);
      }

      if (!response || response.length === 0) {
        throw new Error("Failed to generate response");
      }

      const parsedPersonaResponse = parsePersonaResponse(response);

      const { persona } = await prisma.personaGeneration.create({
        data: {
          inngestEventId: event.id!,
          model: model.id,
          promptVersion: data.promptVersion,
          prompt: {
            connect: {
              id: promptId,
            },
          },
          status: "done",
          persona: {
            create: {
              name: parsedPersonaResponse.name,
              gender: parsedPersonaResponse.gender,
              age: parsedPersonaResponse.age,
              occupation: parsedPersonaResponse.occupation,
              summary: parsedPersonaResponse.summary || "",
              personalityTraits: parsedPersonaResponse.personalityTraits,
              culturalBackground: "",
              interests: parsedPersonaResponse.interests,
              appearance: parsedPersonaResponse.appearance || "",
              background: parsedPersonaResponse.background || "",
              history: parsedPersonaResponse.history || "",
              characteristics: parsedPersonaResponse.characteristics || "",

              creator: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
        select: {
          persona: true,
        },
      });

      const personaId = persona?.id;
      if (!personaId) throw new Error("Failed to create persona");

      await logsnag.track({
        channel: "personas",
        event: "New Persona",
        user_id: userId,
        icon: "🧑",
        notify: false,
        tags: {
          persona: personaId,
          model: model.id,
        },
      });

      await redis
        .set(
          `persona_generation:${data.promptId}:${event.id}`,
          JSON.stringify({
            status: "pending",
            persona: persona,
          }),
          "EX",
          120
        )
        .catch((error) => {
          logger.error(error);
          // We don't want to fail the function if we can't update redis
          // it's not a big issue, not worth to retry and not worth for separate step
        });

      return {
        persona,
      };
    });

    const personaImagePrompt = await step.run(
      "generate-persona-image-prompt",
      async () => {
        let model = TextGenerationModelFactory.create(
          TextGenerationModelsEnum.MetaLlama3_70bInstruct
        );

        let response = "";

        const prompt = realisticPortraitPrompt({
          apperance: persona.appearance,
          age: persona.age,
          gender: persona.gender,
        });

        try {
          response = await model.generateText(prompt);
        } catch (error) {
          logger.error(error);
        }

        model = TextGenerationModelFactory.create(
          TextGenerationModelsEnum.MetaLlama3_8bInstruct
        );

        try {
          response = await model.generateText(prompt);
        } catch (error) {
          logger.error(error);
        }

        if (!response || response.length === 0) {
          throw new Error("Failed to generate response");
        }

        return response;
      }
    );

    const { imageModelId } = await step.run(
      "generate-persona-image",
      async () => {
        try {
          let model = TextToImgModelFactory.create(
            TextToImgModelsEnum.StabilityAIStableDiffusionXL10
          );

          let imgBuffer: Buffer | null = null;

          try {
            imgBuffer = await model.generateImage(personaImagePrompt, {
              width: 1024,
              height: 1024,
            });
          } catch (error) {
            logger.error(error);

            model = TextToImgModelFactory.create(
              TextToImgModelsEnum.StabilityAIStableDiffusionXLBase10
            );

            imgBuffer = await model.generateImage(personaImagePrompt, {
              width: 1024,
              height: 1024,
            });
          }

          if (!imgBuffer) throw new Error("Failed to generate image");

          // Optimize image
          const optimizedImageBuffer = await sharp(imgBuffer)
            .resize({
              width: 1024,
              height: 1024,
            })
            .webp({
              quality: 80,
            })
            .toBuffer();

          /**
           * We need to upload image in the same step as we generate it
           * because of the file size and issue while returning it from step
           */
          await got.put(
            `https://ny.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/personas/${persona.id}/persona-${persona.id}.webp`,
            {
              headers: {
                AccessKey: process.env.BUNNY_CDN_API_KEY,
                "Content-Type": "application/octet-stream",
              },
              body: Buffer.from(optimizedImageBuffer),
            }
          );

          return { imageModelId: model.id };
        } catch (error) {
          logger.error(error);
          throw error;
        }
      }
    );

    await step.run("update-persona-image-url", async () => {
      await prisma.persona.update({
        where: {
          id: persona.id,
        },
        data: {
          mainImageUrl: `https://${process.env.BUNNY_CDN_HOST}/personas/${persona.id}/persona-${persona.id}.webp`,
          images: {
            create: {
              imageUrl: `https://${process.env.BUNNY_CDN_HOST}/personas/${persona.id}/persona-${persona.id}.webp`,
              prompt: personaImagePrompt,
              model: imageModelId,
              creator: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });

      await redis
        .set(
          `persona_generation:${data.promptId}:${event.id}`,
          JSON.stringify({
            status: "done",
            persona: {
              ...persona,
              mainImageUrl: `https://${process.env.BUNNY_CDN_HOST}/personas/${persona.id}/persona-${persona.id}.webp`,
            },
          }),
          "EX",
          10
        )
        .catch((error) => {
          logger.error(error);
          // We don't want to fail the function if we can't update redis
          // it's not a big issue, not worth to retry and not worth for separate step
        });
    });
  }
);

export const syncUser = inngest.createFunction(
  { id: "sync-user-from-clerk" }, // ←The 'id' is an arbitrary string used to identify the function in the dashboard
  { event: "clerk/user.created" }, // ← This is the function's triggering event
  async ({ event, prisma }) => {
    const user = event.data; // The event payload's data will be the Clerk User json object
    const { id, username } = user;
    const email = user.email_addresses.find(
      (e: any) => e.id === user.primary_email_address_id
    ).email;

    await prisma.user.create({
      data: {
        id,
        username: username || "Anonymous",
        email,
        imageUrl: user.image_url,
      },
    });

    await logsnag.track({
      channel: "users",
      event: "New user",
      user_id: id,
      icon: "😊",
      notify: true,
      tags: {
        username,
      },
    });

    await logsnag.identify({
      user_id: id,
      properties: {
        username,
      },
    });
  }
);

export const generatePersonaImage = inngest.createFunction(
  {
    id: "generate-persona-image",
    throttle: {
      limit: 4,
      period: "90s",
      key: "event.data.userId",
    },
    concurrency: [
      {
        limit: 15,
        key: "generate-persona-image",
      },
      {
        limit: 2,
        key: "event.data.userId",
      },
    ],
    retries: 1,
  },
  { event: "app/generate-persona-image.sent" },
  async ({ event, step, logger, prisma, redis, runId }) => {
    const data = event.data;
    assert(data, GeneratePersonaImageEventDataSchema);

    const persona = await step.run("get-persona", async () => {
      const persona = await prisma.persona.findUnique({
        where: {
          id: data.personaId,
        },
      });

      if (!persona) {
        throw new NonRetriableError("Persona not found");
      }

      return persona;
    });

    const prompt = await step.run("generate-persona-image-prompt", async () => {
      let model = TextGenerationModelFactory.create(
        TextGenerationModelsEnum.Qwen2_72bInstruct
      );

      let response = "";

      const prompt =
        data.style === PersonaImageStyleEnum.Photorealistic
          ? data.frame === PersonaImageFrameEnum.Portrait
            ? realisticPortraitPrompt({
                apperance: persona.appearance,
                age: persona.age,
                gender: persona.gender,
              })
            : realisticFullBodyPrompt({
                apperance: persona.appearance,
                age: persona.age,
                style: persona.style,
                gender: persona.gender,
              })
          : data.frame === PersonaImageFrameEnum.Portrait
          ? animePortraitPrompt({
              apperance: persona.appearance,
              age: persona.age,
              gender: persona.gender,
            })
          : animeFullBodyPrompt({
              apperance: persona.appearance,
              age: persona.age,
              style: persona.style,
              gender: persona.gender,
            });

      logger.debug("Prompt: ", prompt);

      try {
        response = await model.generateText(prompt);

        return response;
      } catch (error) {
        logger.error(error);
      }

      model = TextGenerationModelFactory.create(
        TextGenerationModelsEnum.MetaLlama3_8bInstruct
      );

      try {
        response = await model.generateText(prompt);
      } catch (error) {
        logger.error(error);
      }

      if (!response || response.length === 0) {
        throw new Error("Failed to generate response");
      }

      return response;
    });

    const { imageUrl, modelId } = await step.run(
      "generate-persona-image",
      async () => {
        let model = TextToImgModelFactory.create(
          TextToImgModelsEnum.StabilityAIStableDiffusionXLBase10
        );

        model = TextToImgModelFactory.create(
          TextToImgModelsEnum.StabilityAIStableDiffusionXL10
        );

        let imgBuffer: Buffer | null = null;

        try {
          imgBuffer = await model.generateImage(prompt, {
            width: 1024,
            height: 1024,
          });
        } catch (error) {
          logger.error(error);
        }

        if (!imgBuffer) throw new Error("Failed to generate image");

        await logsnag.track({
          channel: "images-ai",
          event: "New image generated",
          user_id: data.userId,
          icon: "🖼️",
          notify: false,
          tags: {
            persona: persona.id,
            style: data.style,
            frame: data.frame,
            model: model.id,
          },
        });

        // Optimize image
        const optimizedImageBuffer = await sharp(imgBuffer)
          .resize({
            width: 1024,
            height: 1024,
          })
          .webp({
            quality: 80,
          })
          .toBuffer();

        const uploadPath = `personas/${persona.id}/${nanoid(12)}.webp`;

        /**
         * We need to upload image in the same step as we generate it
         * because of the file size and issue while returning it from step
         */
        await got.put(
          `https://ny.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${uploadPath}`,
          {
            headers: {
              AccessKey: process.env.BUNNY_CDN_API_KEY,
              "Content-Type": "application/octet-stream",
            },
            body: Buffer.from(optimizedImageBuffer),
          }
        );

        return {
          imageUrl: `https://${process.env.BUNNY_CDN_HOST}/${uploadPath}`,
          modelId: model.id,
        };
      }
    );

    await step.run("save-persona-image-in-db", async () => {
      const { id } = await prisma.image.create({
        data: {
          imageUrl: imageUrl,
          prompt: prompt,
          model: modelId,
          labels: [data.style],
          ai: true,
          persona: {
            connect: {
              id: persona.id,
            },
          },
          creator: {
            connect: {
              id: data.userId,
            },
          },
        },
      });

      // decrease by one the number of pending image generations
      await redis
        .set(
          `user:${data.userId}:personas:${persona.id}:image-generation:${event.id}`,
          JSON.stringify({
            status: "done",
            imageUrl: imageUrl,
            id,
            eventId: event.id,
          }),
          "EX",
          1 * 60 // 1 minute
        )
        .catch((error) => {
          logger.error(error);
          // We don't want to fail the function if we can't update redis
          // it's not a big issue, not worth to retry and not worth for separate step
        });
    });
  }
);
