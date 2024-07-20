// Abtract
import { TextGenerationModel } from "./text-generation-model.abstract";

// Models
import { MetaLlama3_8bInstruct } from "./meta/llama-3-8b-instruct.model";

// Enums
import { TextGenerationModelsEnum } from "./enums/text-generation-models.enum";

export class TextGenerationModelFactory {
  static create(id: TextGenerationModelsEnum): TextGenerationModel {
    switch (id) {
      case TextGenerationModelsEnum.MetaLlama3_8bInstruct:
        return new MetaLlama3_8bInstruct();
      default:
        throw new Error(`Model ${id} not found`);
    }
  }
}