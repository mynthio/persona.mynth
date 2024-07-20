import { Message } from "./types/message.type";

export abstract class TextGenerationModel {
  abstract id: string;

  abstract chat(message: string, history: Message[]): Promise<Message[]>;

  abstract generateText(prompt: string): Promise<string>;
}
