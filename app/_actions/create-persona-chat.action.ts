"use server";

import "server-only";

import { prisma } from "@/prisma/client";
import { CreatePersonaChatSchema } from "@/schemas/create-persona-chat";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export const createPersonaChatAction = async (data: unknown) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  assert(data, CreatePersonaChatSchema);

  const persona = await prisma.persona.findUnique({
    where: { id: data.personaId, creatorId: userId },
  });

  if (!persona) throw new Error("Persona not found");

  const chat = await prisma.chat.create({
    data: {
      personaId: persona.id,
      userId,
      model: "meta-llama/Meta-Llama-3-70B-Instruct",
    },
  });

  return chat;
};
