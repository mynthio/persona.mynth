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
  batchSize: size(number(), 1, 2), // Let's start slowly

  generateImage: optional(boolean()),
});

export type GeneratePersonas = Infer<typeof GeneratePersonasSchema>;
