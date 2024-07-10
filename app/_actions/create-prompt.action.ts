"use server";

import { prisma } from "@/prisma/client";
import {
  CreatePrompt,
  CreatePromptSchema,
} from "@/schemas/create-prompt.schema";
import { auth } from "@clerk/nextjs/server";
import "server-only";
import { assert } from "superstruct";

export const createPromptAction = async (data: CreatePrompt) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, CreatePromptSchema);

  await prisma.personaPrompt.create({
    data: {
      input: JSON.stringify(data),
      personas: {
        create: {
          id: userId,
        },
      },
    },
  });
};
