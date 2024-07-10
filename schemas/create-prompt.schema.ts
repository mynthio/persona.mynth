import {
  array,
  enums,
  Infer,
  object,
  partial,
  size,
  string,
  union,
} from "superstruct";

export const CreatePromptSchema = union([
  partial(
    object({
      style: enums(["realistic", "fantasy"]),
      generationStyle: enums(["detailed_realistic", "strict", "roleplay"]),
      personaName: size(string(), 1, 100),
      gender: enums(["male", "female", "other"]),
      age: string(), // TODO: Validate regex, possible values: '<number>-<number>' or '<number>'
      occupation: array(string()),
    })
  ),
  object({
    textPrompt: size(string(), 1, 1000), // TODO: move limits to common config
  }),
]);

export type CreatePrompt = Infer<typeof CreatePromptSchema>;
