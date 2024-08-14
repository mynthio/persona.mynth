"use server";

import "server-only";

import { deepInfraOpenAi, openai } from "@/lib/open-ai";
import { CoreMessage, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { getPersonaChat } from "../_services/persona-chats.service";
import { logger } from "@/lib/logger";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";

export const chatAction = async (data: {
  content: string;
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
  if (chat.userId !== userId) throw new Error("Not your chat");

  // const { canGenerate } = await checkAndUpdateUserTokens(1);
  // if (!canGenerate) {
  //   throw new Error("Not enough tokens");
  // }

  const userMessage = await prisma.chatMessage.create({
    data: {
      chatId: data.chatId,
      role: "user",
      content: "",
      versions: {
        create: {
          content: data.content,
        },
      },
    },
  });

  const assistantMessage = await prisma.chatMessage.create({
    data: {
      chatId: data.chatId,
      role: "assistant",
      content: "",
    },
  });

  const systemMessage = await prisma.chatMessage.findFirst({
    where: {
      chatId: data.chatId,
      role: "system",
    },
    include: {
      versions: {
        where: {
          selected: true,
        },
        take: 1,
      },
    },
  });

  if (!systemMessage || !systemMessage.versions[0])
    throw new Error("System message not found");

  const messages = [
    {
      id: systemMessage.id,
      role: "system",
      content: systemMessage.versions[0].content,
    },
    ...chat.messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.versions[0].content || "",
    })),
    {
      id: userMessage.id,
      role: "user",
      content: String(data.content),
    },
  ];

  const coreMessages: CoreMessage[] = messages.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  const modelId =
    chat.model === TextGenerationModelsEnum.Sao10kL3_70bEuryaleV2
      ? "Sao10K/L3-70B-Euryale-v2.1"
      : chat.model === TextGenerationModelsEnum.MetaLlama3_70bInstruct
      ? "meta-llama/Meta-Llama-3-70B-Instruct"
      : "Qwen/Qwen2-72B-Instruct";

  const oai =
    chat.model === TextGenerationModelsEnum.Sao10kL3_70bEuryaleV2
      ? deepInfraOpenAi
      : openai;

  const model = oai.chat(modelId);

  const result = await streamText({
    model,
    messages: [...coreMessages, { role: "user", content: data.content }],

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
                  // @ts-ignore
                  ...(finalResult.usage.cost
                    ? // @ts-ignore
                      { cost: finalResult.usage.cost }
                    : {}),
                },
              },
            });

            if (finalResult.finishReason !== "stop") return;
            if (finalResult.text.length < 1) return;

            await prisma.chatMessage.update({
              where: {
                id: assistantMessage.id,
              },
              data: {
                versions: {
                  create: {
                    content: finalResult.text.toString(),
                    selected: true,
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
  return { textStream: stream.value, userMessage, assistantMessage };
};
