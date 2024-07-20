import got from "got";
import { TextGenerationModel } from "../text-generation-model.abstract";
import { Message } from "../types/message.type";
import { TextGenerationModelsEnum } from "../enums/text-generation-models.enum";

export class MetaLlama3_8bInstruct extends TextGenerationModel {
  id = TextGenerationModelsEnum.MetaLlama3_8bInstruct;

  private readonly modelUrl = new URL(
    `https://gateway.ai.cloudflare.com/v1/c99aff4cb614b593e268702200736e8c/persona/workers-ai/@cf/meta/llama-3-8b-instruct`
  );

  async chat(message: string, history: Message[]): Promise<Message[]> {
    return [];
  }

  async generateText(prompt: string): Promise<string> {
    const response = await got
      .post(this.modelUrl.href, {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        },
        json: {
          max_tokens: 1000,
          prompt,
        },
      })
      .json<{
        result: {
          response: string;
        };
      }>();

    return response.result.response;
  }
}
