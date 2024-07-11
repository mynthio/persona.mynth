"use server";

import "server-only";
import axios from "axios";

import { inngest } from "@/inngest";
import { prisma } from "@/prisma/client";
import { GeneratePersonaEventData } from "@/schemas/generate-persona-event-data.schema";
import { GeneratePersonasSchema } from "@/schemas/generate-personas.schema";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";
import { revalidatePath } from "next/cache";

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
          promptInput: prompt.input as any,
          generateImage: !!data.generateImage,
        } satisfies GeneratePersonaEventData,
      }))
  );

  await prisma.personaGeneration.createMany({
    data: ids.map((id) => ({
      id: id,
      promptId: prompt.id,
      status: "pending",
    })),
  });

  revalidatePath(`/prompts/${prompt.id}`);

  return {
    jobIds: ids,
  };
};
