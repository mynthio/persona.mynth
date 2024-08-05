"use server";

import { inngest } from "@/inngest";
import { logger } from "@/lib/logger";
import { redis } from "@/redis/client";
import { GeneratePersonaImageEventDataData } from "@/schemas/generate-persona-image-event-data.schema";
import { GeneratePersonaImageSchema } from "@/schemas/generate-persona-image.schema";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export async function generatePersonaImageAction(data: unknown) {
  logger.debug(data);

  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, GeneratePersonaImageSchema);

  const pendingImageGeneration = await redis
    .get(`user:${userId}:personas:${data.personaId}:image-generation`)
    .then((value) => Number(value));
  if (pendingImageGeneration > 0)
    throw new Error("Image generation is pending");

  const { ids } = await inngest.send(
    Array(data.batchSize)
      .fill(0)
      .map(() => ({
        name: "app/generate-persona-image.sent",
        user: {
          id: userId,
        },
        data: {
          userId,
          personaId: data.personaId,
          quality: data.quality,
          style: data.style,
          frame: data.frame,
          additionalInstructions: data.additionalInstructions,
        } satisfies GeneratePersonaImageEventDataData,
      }))
  );

  return ids;
}
