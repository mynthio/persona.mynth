import { assert } from "superstruct";
import { inngest } from "./client";
import { GeneratePersonaEventData } from "@/schemas/generate-persona-event-data.schema";
import { creatorPrompt, textPrompt } from "@/app/prompts";
import got from "got";
import { parsePersonaResponse } from "@/lib/parser";
import { TextGenerationModelFactory } from "@/lib/ai/text-generation-models/text-generation-model-factory";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";
import { TextToImgModelFactory } from "@/lib/ai/text-to-img-models/text-to-img-model.factory";
import { TextToImgModelsEnum } from "@/lib/ai/text-to-img-models/enums/text-to-img-models.enum";

import sharp from "sharp";
import { logsnag } from "@/lib/logsnag.server";

export const generatePersona = inngest.createFunction(
  {
    id: "generate-persona",
    throttle: {
      limit: 4,
      period: "60s",
      key: "event.data.promptId",
    },
    concurrency: {
      limit: 15, // For free plan we have 20 connections to db, so we need to be careful
    },
    retries: 2,
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

    const userId = event.user.id;
    if (!userId) throw new Error("Not authenticated");

    await step.run("update-persona-generation-status", async () => {
      await redis.set(
        `persona_generation:${data.promptId}:${event.id}`,
        JSON.stringify({
          status: "pending",
          persona: null,
        }),
        "EX",
        5 * 60 // 5 minutes
      );
    });

    const { personaId, appearance, persona } = await step.run(
      "generate-persona",
      async () => {
        const prompt =
          "textPrompt" in data.promptInput
            ? textPrompt(data.promptInput.textPrompt)
            : creatorPrompt(data.promptInput);

        const model = TextGenerationModelFactory.create(
          TextGenerationModelsEnum.MetaLlama3_8bInstruct
        );

        let response = await model.generateText(prompt);

        if (!response || response.length === 0) {
          const res = await got
            .post(`https://api.hyperbolic.xyz/v1/chat/completions`, {
              headers: {
                Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
              },
              json: {
                messages: [
                  {
                    role: "user",
                    content: prompt,
                  },
                ],
                model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
                max_tokens: 2048,
                temperature: 0.7,
                top_p: 0.9,
                stream: false,
              },
            })
            .json();

          response = res.choices[0].message.content;
        }

        const parsedPersonaResponse = parsePersonaResponse(response);

        const { persona } = await prisma.personaGeneration.create({
          data: {
            inngestEventId: event.id!,
            model: model.id,
            promptVersion: data.promptVersion,
            prompt: {
              connect: {
                id: data.promptId,
              },
            },
            status: "done",
            persona: {
              create: {
                name: parsedPersonaResponse.name,
                gender: parsedPersonaResponse.gender,
                age: parsedPersonaResponse.age,
                occupation: parsedPersonaResponse.occupation,
                summary: parsedPersonaResponse.summary,
                personalityTraits: parsedPersonaResponse.personalityTraits,
                interests: parsedPersonaResponse.interests,
                culturalBackground: parsedPersonaResponse.culturalBackground,
                appearance: parsedPersonaResponse.appearance,
                background: parsedPersonaResponse.background,
                history: parsedPersonaResponse.history,
                characteristics: parsedPersonaResponse.characteristics,

                creator: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
          },
          select: {
            persona: {
              select: {
                id: true,
              },
            },
          },
        });

        const personaId = persona?.id;
        if (!personaId) throw new Error("Failed to create persona");

        return {
          personaId,
          appearance: parsedPersonaResponse.appearancePrompt,
          persona: {
            id: personaId,
            name: parsedPersonaResponse.name,
            gender: parsedPersonaResponse.gender,
            age: parsedPersonaResponse.age,
            occupation: parsedPersonaResponse.occupation,
            summary: parsedPersonaResponse.summary,
          },
        };
      }
    );

    await step.run("update-persona-generation-status-completed", async () => {
      await redis.set(
        `persona_generation:${data.promptId}:${event.id}`,
        JSON.stringify({
          status: "pending",
          persona: persona,
        }),
        "EX",
        120
      );
    });

    await step.run("generate-persona-image", async () => {
      try {
        const model = TextToImgModelFactory.create(
          TextToImgModelsEnum.StabilityAIStableDiffusionXL10
        );

        const fallbackModel = TextToImgModelFactory.create(
          TextToImgModelsEnum.StabilityAIStableDiffusionXLBase10
        );

        let imgBuffer: Buffer | null = null;

        try {
          imgBuffer = await model.generateImage(
            appearance +
              ", realistic, ultra hd, 8k, high quality, (photorealism)+",
            {
              width: 1024,
              height: 1024,
              negativePrompt:
                "low quality, drawing, bad anatomy, cartoon, painting",
            }
          );
        } catch (error) {
          logger.error(error);

          imgBuffer = await fallbackModel.generateImage(appearance, {
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
          `https://ny.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/personas/${personaId}/persona-${personaId}.webp`,
          {
            headers: {
              AccessKey: process.env.BUNNY_CDN_API_KEY,
              "Content-Type": "application/octet-stream",
            },
            body: Buffer.from(optimizedImageBuffer),
          }
        );
      } catch (error) {
        logger.error(error);
        throw error;
      }
    });

    await step.run("update-persona-image-url", async () => {
      await prisma.persona.update({
        where: {
          id: personaId,
        },
        data: {
          mainImageUrl: `https://${process.env.BUNNY_CDN_HOST}/personas/${personaId}/persona-${personaId}.webp`,
        },
      });
    });

    await step.run("update-persona-generation-status-completed", async () => {
      await redis.set(
        `persona_generation:${data.promptId}:${event.id}`,
        JSON.stringify({
          status: "done",
          persona: {
            ...persona,
            mainImageUrl: `https://${process.env.BUNNY_CDN_HOST}/personas/${personaId}/persona-${personaId}.webp`,
          },
        }),
        "EX",
        10
      );
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
    });

    await logsnag.identify({
      user_id: id,
      properties: {
        username,
      },
    });
  }
);
