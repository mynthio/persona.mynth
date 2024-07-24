"use server";

import "server-only";

import { openai } from "@/lib/open-ai";
import { CoreMessage, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { checkAndUpdateUserTokens } from "@/lib/tokens";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { getPersonaChat } from "../_services/persona-chats.service";

export const chatAction = async (data: {
  messages: CoreMessage[];
  isLocal?: boolean;
  chatId: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const chat = await getPersonaChat({
    chatId: data.chatId,
    userId,
  });

  if (!chat) throw new Error("Chat not found");

  const { canGenerate } = await checkAndUpdateUserTokens(1);

  if (!canGenerate) {
    throw new Error("Not enough tokens");
  }

  const result = await streamText({
    model: openai.chat("meta-llama/Meta-Llama-3.1-405B-Instruct"),
    messages: data.messages,
    ...(data.isLocal
      ? {}
      : {
          onFinish: async (finalResult) => {
            if (finalResult.finishReason !== "stop") return;
            if (finalResult.text.length < 1) return;

            await prisma.chat.update({
              where: {
                id: data.chatId!,
                userId,
              },
              data: {
                messages: {
                  createMany: {
                    data: [
                      {
                        role: "user",
                        content:
                          data.messages[
                            data.messages.length - 1
                          ].content.toString(),
                      },
                      {
                        role: "assistant",
                        content: finalResult.text.toString(),
                      },
                    ],
                  },
                },
              },
            });
          },
        }),
  }).catch((e) => {
    console.error(e);
    return { textStream: e.message };
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
};
