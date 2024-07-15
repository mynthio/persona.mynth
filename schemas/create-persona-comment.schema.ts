import { Infer, object, size, string } from "superstruct";

export const CreatePersonaCommentSchema = object({
  personaId: string(),
  content: size(string(), 1, 1000),
});

export type CreatePersonaCommentInput = Infer<
  typeof CreatePersonaCommentSchema
>;
