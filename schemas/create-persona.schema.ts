import { boolean, enums, Infer, max, object, size, string } from "superstruct";

export const CreatePersonaSchema = object({
  name: size(string(), 1, 125),
  gender: enums(["male", "female", "other"]),
  age: size(string(), 1, 30),
  appearance: size(string(), 1, 1000),
  style: size(string(), 1, 1000),
  background: size(string(), 1, 1000),
  history: size(string(), 1, 1000),
  characteristics: size(string(), 1, 1000),
  personalityTraits: size(string(), 1, 1000),
  interests: size(string(), 1, 1000),
  occupation: size(string(), 1, 255),
  summary: size(string(), 1, 255),
  isNsfw: boolean(),
});

export type CreatePersonaData = Infer<typeof CreatePersonaSchema>;
