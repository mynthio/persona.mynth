"use server";

import "server-only";

import { logger } from "@/lib/logger";
import { logsnag } from "@/lib/logsnag.server";
import { prisma } from "@/prisma/client";
import { CreateChatData, CreateChatSchema } from "@/schemas/create-chat.schema";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export const createChatAction = async (data: CreateChatData) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");

  assert(data, CreateChatSchema);

  const chat = await prisma.chat
    .create({
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
    })
    .catch((e) => {
      logger.error(e);
      throw new Error("Failed to create chat");
    });

  await logsnag.track({
    channel: "chats",
    event: "New chat",
    user_id: userId,
    icon: "💬",
    tags: {
      model: data.model,
      persona: data.personaId,
    },
  });

  return chat;
};
