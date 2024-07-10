import { number, object, partial, size, string, union } from "superstruct";

export const GeneratePersonaEventData = object({
  promptId: string(),
  creatorId: string(),

  batchSize: size(number(), 1, 2),
});
