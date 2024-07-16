import { assert } from "superstruct";
import { inngest } from "./client";
import { GeneratePersonaEventData } from "@/schemas/generate-persona-event-data.schema";
import { creatorPrompt, textPrompt } from "@/app/prompts";
import got from "got";
import { parsePersonaResponse } from "@/lib/parser";

export const generatePersona = inngest.createFunction(
  {
    id: "generate-persona",
    throttle: {
      limit: 4,
      period: "60s",
      key: "event.data.promptId",
    },
    concurrency: {
      limit: 20,
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
        const modelUrl = new URL(
          `https://gateway.ai.cloudflare.com/v1/c99aff4cb614b593e268702200736e8c/persona/workers-ai/@cf/meta/llama-3-8b-instruct`
        );

        const prompt =
          "textPrompt" in data.promptInput
            ? textPrompt(data.promptInput.textPrompt)
            : creatorPrompt(data.promptInput);

        const response = await got
          .post(modelUrl.href, {
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            },
            json: {
              max_tokens: 1000,
              prompt,
            },
          })
          .json<{
            result: {
              response: string;
            };
          }>();

        const parsedPersonaResponse = parsePersonaResponse(
          response.result.response
        );

        const { persona } = await prisma.personaGeneration.create({
          data: {
            inngestEventId: event.id!,
            model: "meta/llama-3-8b-instruct",
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
      const imageModel = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
      const modelUrl = new URL(
        `https://gateway.ai.cloudflare.com/v1/c99aff4cb614b593e268702200736e8c/persona/workers-ai/${imageModel}`
      );

      try {
        const response = await got
          .post(modelUrl.href, {
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            },
            json: {
              width: 1024,
              height: 1024,
              negative_prompt:
                "cartoon, anime, 2d, painting, drawing, sketch, watercolor, photo, realistic, unrealistic, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, blurry",
              prompt: appearance,
            },
          })
          .buffer();

        /**
         * We need to upload image in the same step as we generate it
         * because of the file size and issue while returning it from step
         */
        await got.put(
          `https://ny.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/persona-${personaId}.png`,
          {
            headers: {
              AccessKey: process.env.BUNNY_CDN_API_KEY,
              "Content-Type": "application/octet-stream",
            },
            body: Buffer.from(response),
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
          mainImageUrl: `https://${process.env.BUNNY_CDN_HOST}/persona-${personaId}.png`,
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
            mainImageUrl: `https://${process.env.BUNNY_CDN_HOST}/persona-${personaId}.png`,
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
  }
);
