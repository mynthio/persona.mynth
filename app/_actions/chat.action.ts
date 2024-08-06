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
import { TextGenerationModel } from "@/lib/ai/text-generation-models/text-generation-model.abstract";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";

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
  if (chat.userId !== userId) throw new Error("Not your chat");

  // const { canGenerate } = await checkAndUpdateUserTokens(1);
  // if (!canGenerate) {
  //   throw new Error("Not enough tokens");
  // }

  const messages = chat.messages;
  const persona = chat.persona;
  const userCharacter = chat.userCharacter
    ? JSON.parse(chat.userCharacter)
    : {
        name: "User",
        character: "",
      };

  if (!persona) throw new Error("Persona not found");

  const systemMessage = {
    role: "system" as const,
    content: `You're playing a role of ${persona.name} in roleplay chat with ${
      userCharacter.name
    }. Behave like a provided character only. Be creative, move story forward, answer questions, make it like a real experience, talk scenes. Write only as character, don't write as user. Dont't repeat yourself. Don't prefix your text with character name etc.
    
Your character:
Name: ${persona.name}
Age: ${persona.age}
Occupation: ${persona.occupation}
Summary: ${persona.summary}
Personality traits: ${persona.personalityTraits}
Interests: ${persona.interests}
Cultural background: ${persona.culturalBackground}
Appearance: ${persona.appearance}
Background: ${persona.background}
History: ${persona.history}
Characteristics: ${persona.characteristics}

User character:
Name: ${userCharacter.name}
Character: ${userCharacter.character}

Scenario: ${
      chat.scenario
        ? chat.scenario
        : "Scenario not provided. Be creative. Come up with something based on user first messages."
    }`,
  };

  const coreMessages: CoreMessage[] = messages.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  const modelId =
    chat.model === TextGenerationModelsEnum.MetaLlama3_70bInstruct
      ? "meta-llama/Meta-Llama-3-70B-Instruct"
      : "Qwen/Qwen2-72B-Instruct";

  const model = openai.chat(modelId);

  const result = await streamText({
    model,
    messages: [systemMessage, ...coreMessages, data.messages[0]],
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
