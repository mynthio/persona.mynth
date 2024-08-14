"use server";

import "server-only";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { getPersonaChat } from "../_services/persona-chats.service";
import { revalidatePath } from "next/cache";

export const deleteChatMessageAction = async (data: {
  messageId: string;
  chatId: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const chat = await getPersonaChat({
    chatId: data.chatId,
    userId,
  });

  if (!chat) throw new Error("Chat not found");
  if (chat.userId !== userId) throw new Error("Not your chat");

  const lastUserMessage = chat.messages.findLast((m) => m.role === "user");
  if (!lastUserMessage) throw new Error("Last user message not found");
  if (lastUserMessage.id !== data.messageId)
    throw new Error("Last user message not found");

  const lastAssistantMessage = chat.messages.findLast(
    (m) => m.role === "assistant"
  );
  if (!lastAssistantMessage)
    throw new Error("Last assistant message not found");

  await prisma.chatMessage.deleteMany({
    where: {
      id: {
        in: [lastUserMessage.id, lastAssistantMessage.id],
      },
    },
  });

  revalidatePath(`/library/personas/${chat.personaId}/chats/${chat.id}`);
};
