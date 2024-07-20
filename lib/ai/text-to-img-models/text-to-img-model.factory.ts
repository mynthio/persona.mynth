import { TextToImgModelsEnum } from "./enums/text-to-img-models.enum";
import { StabilityAIStableDiffusionXL10 } from "./stabilityai/stable-diffusion-xl-10.model";
import { StabilityAIStableDiffusionXLBase10 } from "./stabilityai/stable-diffusion-xl-base-10.model";
import { TextToImgModel } from "./text-to-img-model.abstract";

export class TextToImgModelFactory {
  static create(id: TextToImgModelsEnum): TextToImgModel {
    switch (id) {
      case TextToImgModelsEnum.StabilityAIStableDiffusionXLBase10:
        return new StabilityAIStableDiffusionXLBase10();
      case TextToImgModelsEnum.StabilityAIStableDiffusionXL10:
        return new StabilityAIStableDiffusionXL10();
      default:
        throw new Error(`Model ${id} not found`);
    }
  }
}
