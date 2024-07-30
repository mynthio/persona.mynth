import { Infer, object, string } from "superstruct";

export const CopyPersonaSchema = object({
  personaId: string(),
});

export type CopyPersonaInput = Infer<typeof CopyPersonaSchema>;
