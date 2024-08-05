// Abtract
import { TextGenerationModel } from "./text-generation-model.abstract";

// Models
import { MetaLlama3_8bInstruct } from "./meta/llama-3-8b-instruct.model";

// Enums
import { TextGenerationModelsEnum } from "./enums/text-generation-models.enum";
import { Qwen2_72bInstruct } from "./qwen/qwen2-72b-instruct";

export class TextGenerationModelFactory {
  static create(id: TextGenerationModelsEnum): TextGenerationModel {
    switch (id) {
      case TextGenerationModelsEnum.MetaLlama3_8bInstruct:
        return new MetaLlama3_8bInstruct();
      case TextGenerationModelsEnum.MetaLlama3_70bInstruct:
        return new MetaLlama3_8bInstruct();
      case TextGenerationModelsEnum.Qwen2_72bInstruct:
        return new Qwen2_72bInstruct();
      default:
        throw new Error(`Model ${id} not found`);
    }
  }
}
