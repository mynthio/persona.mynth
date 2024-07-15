import {
  boolean,
  Infer,
  number,
  object,
  optional,
  size,
  string,
} from "superstruct";

export const GeneratePersonasSchema = object({
  promptId: string(),
  batchSize: size(number(), 1, 4), // Let's start slowly with max 4 for all

  generateImage: optional(boolean()),
});

export type GeneratePersonas = Infer<typeof GeneratePersonasSchema>;
