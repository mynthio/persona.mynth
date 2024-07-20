"use server";

import "server-only";

import { openai } from "@/lib/open-ai";
import { CoreMessage, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { checkAndUpdateUserTokens } from "@/lib/tokens";

export const chatAction = async (data: { messages: CoreMessage[] }) => {
  const { canGenerate } = await checkAndUpdateUserTokens(1);

  if (!canGenerate) {
    throw new Error("Not enough tokens");
  }

  const result = await streamText({
    model: openai.chat("meta-llama/Meta-Llama-3-70B-Instruct"),
    messages: data.messages,
  }).catch((e) => {
    console.error(e);
    return { textStream: e.message };
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
};
