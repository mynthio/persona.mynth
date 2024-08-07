import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  baseURL: "https://api.hyperbolic.xyz/v1",
  compatibility: "compatible",
  apiKey: process.env.HYPERBOLIC_API_KEY,
});

export const deepInfraOpenAi = createOpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  compatibility: "compatible",
  apiKey: process.env.DEEP_INFRA_API_KEY,
});
