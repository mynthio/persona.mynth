import got from "got";

import { TextToImgModelsEnum } from "../enums/text-to-img-models.enum";
import { TextToImgModel } from "../text-to-img-model.abstract";
import { GenerateImageOptions } from "../types/generate-image-options.type";

export class StabilityAIStableDiffusionXL10 extends TextToImgModel {
  id = TextToImgModelsEnum.StabilityAIStableDiffusionXL10;

  private readonly modelUrl = new URL(
    `https://api.hyperbolic.xyz/v1/image/generation`
  );

  async generateImage(
    prompt: string,
    options: GenerateImageOptions
  ): Promise<Buffer> {
    const response = await got
      .post(this.modelUrl.href, {
        headers: {
          Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
        },
        json: {
          model_name: "SDXL1.0-base",
          width: options.width || 1024,
          height: options.height || 1024,
          enable_refiner: true,
          negative_prompt: options.negativePrompt,
          prompt,
        },
      })
      .json<{
        images?: { image: string }[];
      }>();

    if (!response.images || response.images.length === 0)
      throw new Error("No images returned");

    return Buffer.from(response.images[0].image, "base64");
  }
}
