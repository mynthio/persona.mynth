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
import { Coins, Send } from "lucide-react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import { ScrollShadow } from "@nextui-org/react";
type Props = {
  personaId: string;
  personaName: string;
  personaImageUrl: string | null;
  systemMessage: string;
};

export default function Chat({
  personaId,
  personaName,
  personaImageUrl,
  systemMessage,
}: Props) {
  const { user } = useUser();

  const savedChat = JSON.parse(
    localStorage.getItem(`chat:${personaId}`) || "null"
  );

  const [messages, setMessages] = React.useState<CoreMessage[]>(
    savedChat && savedChat.messages.length > 0
      ? savedChat.messages
      : [{ role: "system", content: systemMessage }]
  );

  const { handleSubmit, register } = useForm<{
    content: string;
  }>();

  React.useEffect(() => {
    localStorage.setItem(
      `chat:${personaId}`,
      JSON.stringify({ updatedAt: new Date(), messages })
    );
  }, [messages, personaId]);

  React.useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
    });
  }, []);

  return (
    <div className="mt-10 relative ">
      <div className="w-full space-y-4">
        {messages.map((m) =>
          m.role === "system" ? null : (
            <Card
              key={m.id}
              className={`${m.role === "user" ? "ml-10" : "mr-10"} w-auto`}
            >
              <CardBody>{m.content.toString()}</CardBody>

              <CardFooter>
                <User
                  name={m.role === "user" ? user?.username : personaName}
                  avatarProps={{
                    src:
                      m.role === "user"
                        ? user?.imageUrl
                        : personaImageUrl || "",
                  }}
                />
              </CardFooter>
            </Card>
          )
        )}
      </div>

      <form
        className="mt-4"
        onSubmit={handleSubmit(async (data) => {
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: data.content, role: "user" },
          ];

          const result = await chatAction({
            messages: newMessages,
            isLocal: true,
          });

          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
            window.scrollTo({
              top: document.body.scrollHeight,
            });
          }
        })}
      >
        <Textarea
          {...register("content")}
          type="text"
          placeholder="Type your message here"
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
