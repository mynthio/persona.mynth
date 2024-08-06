"use server";

import { prisma } from "@/prisma/client";
import { CreateChatData, CreateChatSchema } from "@/schemas/create-chat.schema";
import { auth } from "@clerk/nextjs/server";
import "server-only";
import { assert } from "superstruct";

export const createChatAction = async (data: CreateChatData) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");

  assert(data, CreateChatSchema);

  const chat = await prisma.chat.create({
    data: {
      type: "chat",
      personaId: data.personaId,
      name: data.name,
      model: data.model,
      scenario: data.scenario,
      userId,
      userCharacter: JSON.stringify({
        name: data.userName,
        character: data.userCharacter,
      }),
    },
    select: {
      id: true,
    },
  });

  return chat;
};
