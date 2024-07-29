import { boolean, Infer, number, object, string } from "superstruct";
import { CreatePromptSchema } from "./create-prompt.schema";

export const GeneratePersonaEventData = object({
  userId: string(),
  promptVersion: number(),
  promptId: string(),
  generateImage: boolean(),
  promptInput: CreatePromptSchema,
});

export type GeneratePersonaEventData = Infer<typeof GeneratePersonaEventData>;
