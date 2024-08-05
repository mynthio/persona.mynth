"use server";

import "server-only";

import { jsonSchema, tool } from "ai";
import { openai } from "@/lib/open-ai";
import { CoreMessage, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { checkAndUpdateUserTokens } from "@/lib/tokens";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { getPersonaChat } from "../_services/persona-chats.service";
import { logger } from "@/lib/logger";

const myMemorySchema = jsonSchema<{
  memory: {
    content: string;
    keywords: string[];
  };
}>({
  type: "object",
  properties: {
    memory: {
      type: "object",
      properties: {
        content: { type: "string" },
        keywords: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["content", "keywords"],
    },
  },
  required: ["memory"],
});

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

  const model = openai.chat("meta-llama/Meta-Llama-3-70B-Instruct");

  const result = await streamText({
    tools: {
      memory: tool({
        description: "save memory",
        parameters: myMemorySchema,
        execute: async ({ memory }) => {
          console.log("memory", memory);
          logger.debug("Memory created", { memory });
        },
      }),
    },
    model,
    messages: data.messages,
    ...(data.isLocal
      ? {}
      : {
          onFinish: async (finalResult) => {
            logger.info("Chat response generation onFinish callback", {
              data: JSON.stringify({
                finishReason: finalResult.finishReason,
                warnings: finalResult.warnings,
              }),
              ai: {
                model: {
                  id: model.modelId,
                  provider: model.provider,
                },
                usage: {
                  completionTokens: finalResult.usage.completionTokens,
                  promptTokens: finalResult.usage.promptTokens,
                  totalTokens: finalResult.usage.totalTokens,
                },
              },
            });

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
    logger.error(e);
    return { textStream: e.message };
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
};
