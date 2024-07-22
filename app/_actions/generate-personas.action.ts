"use server";

import "server-only";

import { inngest } from "@/inngest";
import { prisma } from "@/prisma/client";
import { GeneratePersonaEventData } from "@/schemas/generate-persona-event-data.schema";
import { GeneratePersonasSchema } from "@/schemas/generate-personas.schema";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";
import { redis } from "@/redis/client";
import { checkAndUpdateUserTokens } from "@/lib/tokens";
import { TextToImgModelFactory } from "@/lib/ai/text-to-img-models/text-to-img-model.factory";
import { TextToImgModelsEnum } from "@/lib/ai/text-to-img-models/enums/text-to-img-models.enum";
import { MetaLlama3_8bInstruct } from "@/lib/ai/text-generation-models/meta/llama-3-8b-instruct.model";
import got from "got";

export const generatePersonasAction = async (data: unknown) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, GeneratePersonasSchema);

  const prompt = await prisma.personaPrompt.findUnique({
    where: {
      id: data.promptId,
    },
  });

  if (!prompt) throw new Error("Prompt not found");

  const isAuthor = prompt.creatorId === userId;
  if (!isAuthor) throw new Error("Not authorized");

  // TODO: Check rate limitting
  const { canGenerate, remainingTokens } = await checkAndUpdateUserTokens(
    data.batchSize
  );

  if (!canGenerate) {
    return {
      ok: false,
      canGenerate,
      remainingTokens,
    };
  }

  const { ids } = await inngest.send(
    Array(data.batchSize)
      .fill(0)
      .map(() => ({
        name: "app/generate-persona.sent",
        user: {
          id: userId,
        },
        data: {
          promptId: prompt.id,
          promptVersion: prompt.xata_version,
          promptInput: prompt.input as any,
          generateImage: !!data.generateImage,
        } satisfies GeneratePersonaEventData,
      }))
  );

  ids.forEach((id) =>
    redis.set(
      `persona_generation:${data.promptId}:${id}`,
      JSON.stringify({
        status: "queued",
      }),
      "EX",
      86400 // 24 hours
    )
  );

  return {
    jobIds: ids,
  };
};
