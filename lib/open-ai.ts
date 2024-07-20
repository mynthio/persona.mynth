import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  baseURL: "https://api.hyperbolic.xyz/v1",
  compatibility: "compatible",
  apiKey: process.env.HYPERBOLIC_API_KEY,
});
