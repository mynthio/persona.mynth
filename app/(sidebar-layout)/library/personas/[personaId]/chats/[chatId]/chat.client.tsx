"use client";

import { Message } from "@/lib/ai/text-generation-models/types/message.type";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { readStreamableValue } from "ai/rsc";
import { CoreMessage } from "ai";
import React from "react";
import { chatAction } from "@/app/_actions/chat.action";
import { useUser } from "@clerk/nextjs";
import { Coins, Send } from "lucide-react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { User } from "@nextui-org/user";
type Props = {
  chatId: string;
  personaName: string;
  personaImageUrl: string | null;
  initialMessages: Message[];
};

export default function Chat({
  chatId,
  personaName,
  personaImageUrl,
  initialMessages,
}: Props) {
  const { user } = useUser();

  const [messages, setMessages] =
    React.useState<CoreMessage[]>(initialMessages);

  const { handleSubmit, register, reset } = useForm<{
    content: string;
  }>();

  return (
    <div className="space-y-4">
      {messages.map((m) =>
        m.role === "system" ? null : (
          <Card
            key={m.id}
            className={`${
              m.role === "user" ? "mr-10" : "ml-10"
            } bg-default-100/50 px-3  py-4`}
          >
            <CardBody className="text-foreground-500 text-balance">
              {m.content.toString()}
            </CardBody>

            <CardFooter>
              <User
                name={m.role === "user" ? user?.username : personaName}
                avatarProps={{
                  src:
                    m.role === "user" ? user?.imageUrl : personaImageUrl || "",
                }}
              />
            </CardFooter>
          </Card>
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
            chatId: chatId,
          });

          reset();

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
          className="pr-10"
          classNames={{
            inputWrapper: "bg-default-100/50",
          }}
        />

        <div className="mt-4 flex items-center gap-4">
          <Button
            variant="shadow"
            color="secondary"
            type="submit"
            endContent={<Send size={12} />}
          >
            Send
          </Button>

          <p className="flex items-center gap-2 text-small text-foreground-500">
            1 <Coins size={12} />
          </p>
        </div>
      </form>
    </div>
  );
}
