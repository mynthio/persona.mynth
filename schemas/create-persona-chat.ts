import { Infer, object, string } from "superstruct";

export const CreatePersonaChatSchema = object({
  personaId: string(),
  // model: string(), TODO: Add model selection
});

export type CreatePersonaChatInput = Infer<typeof CreatePersonaChatSchema>;
