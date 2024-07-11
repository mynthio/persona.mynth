import { boolean, Infer, object, string } from "superstruct";
import { CreatePromptSchema } from "./create-prompt.schema";

export const GeneratePersonaEventData = object({
  promptId: string(),
  generateImage: boolean(),
  promptInput: CreatePromptSchema,
});

export type GeneratePersonaEventData = Infer<typeof GeneratePersonaEventData>;
