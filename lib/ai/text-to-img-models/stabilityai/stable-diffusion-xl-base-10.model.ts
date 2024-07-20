import got from "got";
import { TextToImgModelsEnum } from "../enums/text-to-img-models.enum";
import { TextToImgModel } from "../text-to-img-model.abstract";
import { GenerateImageOptions } from "../types/generate-image-options.type";

export class StabilityAIStableDiffusionXLBase10 extends TextToImgModel {
  id = TextToImgModelsEnum.StabilityAIStableDiffusionXLBase10;

  private readonly modelUrl = new URL(
    `https://gateway.ai.cloudflare.com/v1/c99aff4cb614b593e268702200736e8c/persona/workers-ai/@cf/stabilityai/stable-diffusion-xl-base-1.0`
  );

  async generateImage(
    prompt: string,
    options: GenerateImageOptions
  ): Promise<Buffer> {
    const response = await got
      .post(this.modelUrl.href, {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        },
        json: {
          width: options.width || 1024,
          height: options.height || 1024,
          negative_prompt:
            options.negativePrompt ||
            "cartoon, anime, 2d, painting, drawing, sketch, watercolor, photo, realistic, unrealistic, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, blurry",
          prompt,
        },
      })
      .buffer();

    return response;
  }
}
