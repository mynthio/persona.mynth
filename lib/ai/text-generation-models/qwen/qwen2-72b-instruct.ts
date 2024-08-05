import got from "got";
import { TextGenerationModel } from "../text-generation-model.abstract";
import { Message } from "../types/message.type";
import { TextGenerationModelsEnum } from "../enums/text-generation-models.enum";

export class Qwen2_72bInstruct extends TextGenerationModel {
  id = TextGenerationModelsEnum.Qwen2_72bInstruct;

  private readonly modelUrl = new URL(
    `https://api.hyperbolic.xyz/v1/chat/completions`
  );

  async chat(message: string, history: Message[]): Promise<Message[]> {
    return [];
  }

  async generateText(prompt: string): Promise<string> {
    const response = await got
      .post(this.modelUrl.href, {
        headers: {
          Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
        },
        json: {
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "Qwen/Qwen2-72B-Instruct",
          max_tokens: 2048,
          temperature: 0.7,
          top_p: 0.9,
        },
      })
      .json<{
        choices: {
          message: {
            content: string;
          };
        }[];
      }>();

    const content = response.choices[0].message.content;

    if (!content || content.length === 0) throw new Error("Empty response");

    return content;
  }
}
