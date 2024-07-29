import {
  array,
  boolean,
  enums,
  Infer,
  number,
  object,
  partial,
  size,
  string,
  union,
} from "superstruct";

export const CreatorPromptSchema = partial(
  object({
    style: enums(["realistic", "fantasy", "anime"]),
    personaName: size(string(), 0, 100),
    gender: enums(["male", "female", "other", "random"]),
    age: string(),
    occupations: array(object({ occupation: string() })),
    occupationCustom: string(),
    personalityTraits: array(object({ trait: string() })),
    personalityTraitsCustom: string(),
    apperance: partial(
      object({
        hairLength: string(),
        hairColor: string(),
        eyeColor: string(),
        skinColor: string(),
        bodyType: string(),
        custom: string(),
      })
    ),
    hobbies: array(
      object({
        hobby: string(),
      })
    ),
    hobbiesCustom: string(),
    relationship: array(
      object({
        relationship: string(),
      })
    ),
    relationshipCustom: string(),
  })
);

export type CreatorPrompt = Infer<typeof CreatorPromptSchema>;

export const TextPromptSchema = object({
  textPrompt: size(string(), 5, 1000), // TODO: move limits to common config
});

export type TextPrompt = Infer<typeof TextPromptSchema>;

export const CreatePromptSchema = union([
  CreatorPromptSchema,
  TextPromptSchema,
]);

export type CreatePrompt = Infer<typeof CreatePromptSchema>;
