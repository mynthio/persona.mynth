"use server";

import "server-only";

import { prisma } from "@/prisma/client";
import {
  CreatePrompt,
  CreatePromptSchema,
} from "@/schemas/create-prompt.schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export const createPromptAction = async (data: CreatePrompt) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, CreatePromptSchema);

  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const { id } = await prisma.personaPrompt.create({
    data: {
      input: data,
      creator: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return {
    personaPromptId: id,
  };
};
