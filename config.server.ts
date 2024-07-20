import "server-only";
import { TextGenerationModelsEnum } from "./lib/ai/text-generation-models/enums/text-generation-models.enum";

type TextGenerationModelConfig = {
  id: TextGenerationModelsEnum;
};

type ServerConfig = {
  defaultDailyTokens: number;

  textGenerationModels: Record<
    TextGenerationModelsEnum,
    TextGenerationModelConfig
  >;
};

export const serverConfig = {
  defaultDailyTokens: 100,
  textGenerationModels: {
    [TextGenerationModelsEnum.MetaLlama3_8bInstruct]: {
      id: TextGenerationModelsEnum.MetaLlama3_8bInstruct,
    },
  },
} satisfies ServerConfig;
