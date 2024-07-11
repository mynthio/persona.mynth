import { assert } from "superstruct";
import { inngest } from "./client";
import { GeneratePersonaEventData } from "@/schemas/generate-persona-event-data.schema";
import { textPrompt } from "@/app/prompts";
import got from "got";
import { parsePersonaResponse } from "@/lib/parser";

export const generatePersona = inngest.createFunction(
  {
    id: "generate-persona",
    throttle: {
      limit: 10,
      period: "1s",
      burst: 2,
    },
    retries: 3,
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
        86400
      );
    });

    const { personaId, appearance } = await step.run(
      "generate-persona",
      async () => {
        const modelUrl = new URL(
          `https://gateway.ai.cloudflare.com/v1/c99aff4cb614b593e268702200736e8c/persona/workers-ai/@cf/meta/llama-3-8b-instruct`
        );

        if (!("textPrompt" in data.promptInput)) {
          throw new Error("No prompt input provided");
        }

        const response = await got
          .post(modelUrl.href, {
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            },
            json: {
              max_tokens: 1000,
              prompt: textPrompt(data.promptInput.textPrompt),
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

        const { personaId } = await prisma.personaGeneration.update({
          where: {
            id: event.id,
          },
          data: {
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

                prompt: {
                  connect: {
                    id: data.promptId,
                  },
                },
              },
            },
          },
        });

        if (!personaId) throw new Error("Failed to create persona");

        return {
          personaId,
          appearance: parsedPersonaResponse.appearance,
        };
      }
    );

    if (data.generateImage) {
      const generatedBuffer = await step.run(
        "generate-persona-image",
        async () => {
          const modelUrl = new URL(
            `https://gateway.ai.cloudflare.com/v1/c99aff4cb614b593e268702200736e8c/persona/workers-ai/@cf/lykon/dreamshaper-8-lcm`
          );

          const response = await got
            .post(modelUrl.href, {
              headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
              },
              json: {
                prompt: `realistic portrait of ${appearance.toLowerCase()}`,
              },
            })
            .buffer();

          return response;
        }
      );

      await step.run("upload-persona-image", async () => {
        await got.put(
          `https://ny.storage.bunnycdn.com/persona-mynth-dev/persona-${personaId}.png`,
          {
            headers: {
              AccessKey: process.env.BUNNY_CDN_API_KEY,
              "Content-Type": "application/octet-stream",
            },
            body: Buffer.from(generatedBuffer.data),
          }
        );
      });

      await step.run("update-persona-image-url", async () => {
        await prisma.persona.update({
          where: {
            id: personaId,
          },
          data: {
            mainImageUrl: `https://persona-mynth-dev.b-cdn.net/persona-${personaId}.png`,
          },
        });
      });
    }

    await step.run("update-persona-generation-status-completed", async () => {
      await redis.set(
        `persona_generation:${data.promptId}:${event.id}`,
        JSON.stringify({
          status: "done",
          persona: {},
        }),
        "EX",
        120
      );
    });
  }
);
