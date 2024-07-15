import { assign, boolean, object, partial, string } from "superstruct";

export const UpdatePersonaSchema = assign(
  object({
    personaId: string(),
  }),
  partial(
    object({
      name: string(),
      isNsfw: boolean(),
      published: boolean(),
    })
  )
);
