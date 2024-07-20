import { TextToImgModelsEnum } from "./enums/text-to-img-models.enum";
import { GenerateImageOptions } from "./types/generate-image-options.type";

export abstract class TextToImgModel {
  abstract id: TextToImgModelsEnum;

  abstract generateImage(
    prompt: string,
    options: GenerateImageOptions
  ): Promise<Buffer>;
}
