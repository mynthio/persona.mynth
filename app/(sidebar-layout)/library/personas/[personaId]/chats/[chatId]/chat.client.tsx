"use client";

import { Message } from "@/lib/ai/text-generation-models/types/message.type";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { createStreamableValue, readStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@/lib/open-ai";
import React from "react";
import { chatAction } from "@/app/_actions/chat.action";
import { useUser } from "@clerk/nextjs";
import { Coins } from "lucide-react";
type Props = {
  chatId: string;
  personaName: string;
  initialMessages: Message[];
};

export default function Chat({ chatId, personaName, initialMessages }: Props) {
  const { user } = useUser();

  const [messages, setMessages] =
    React.useState<CoreMessage[]>(initialMessages);

  const { handleSubmit, register } = useForm<{
    content: string;
  }>();

  return (
    <div className="space-y-4">
      {messages.map((m) =>
        m.role === "system" ? null : (
          <div key={m.id}>
            {m.role === "user" ? user?.username : personaName}:{" "}
            {m.content.toString()}
          </div>
        )
      )}

      <form
        onSubmit={handleSubmit(async (data) => {
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: data.content, role: "user" },
          ];

          const result = await chatAction({
            messages: newMessages,
          });

          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
          }
        })}
      >
        <Textarea
          {...register("content")}
          type="text"
          placeholder="Type your message here"
        />

        <Button type="submit">
          Send (1
          <Coins size={12} />)
        </Button>
      </form>
    </div>
  );
}
