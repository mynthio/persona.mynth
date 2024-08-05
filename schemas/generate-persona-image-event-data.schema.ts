import {
  enums,
  Infer,
  number,
  object,
  optional,
  size,
  string,
} from "superstruct";

// Enums
import { PersonaImageQualityEnum } from "@/enums/persona-image-quality.enum";
import { PersonaImageStyleEnum } from "@/enums/persona-image-style.enum";
import { PersonaImageFrameEnum } from "@/enums/persona-image-frame.enum";

export const GeneratePersonaImageEventDataSchema = object({
  personaId: string(),
  userId: string(),

  style: enums(Object.values(PersonaImageStyleEnum)),
  frame: enums(Object.values(PersonaImageFrameEnum)),
  quality: enums(Object.values(PersonaImageQualityEnum)),

  additionalInstructions: optional(string()),
});

export type GeneratePersonaImageEventDataData = Infer<
  typeof GeneratePersonaImageEventDataSchema
>;
