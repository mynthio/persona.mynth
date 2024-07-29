import { boolean, Infer, object, optional, string } from "superstruct";

export const UpdatePersonaSchema = object({
  personaId: string(),
  name: optional(string()),
  isNsfw: optional(boolean()),
  published: optional(boolean()),
});

export type UpdatePersonaInput = Infer<typeof UpdatePersonaSchema>;
