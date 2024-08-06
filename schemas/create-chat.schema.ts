import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";
import { enums, Infer, object, optional, size, string } from "superstruct";

export const CreateChatSchema = object({
  personaId: string(),

  model: enums([
    TextGenerationModelsEnum.MetaLlama3_70bInstruct,
    TextGenerationModelsEnum.Qwen2_72bInstruct,
  ]),

  name: optional(size(string(), 0, 125)),
  scenario: optional(size(string(), 0, 1000)),

  userName: optional(size(string(), 0, 125)),
  userCharacter: optional(size(string(), 0, 1000)),
});

export type CreateChatData = Infer<typeof CreateChatSchema>;
