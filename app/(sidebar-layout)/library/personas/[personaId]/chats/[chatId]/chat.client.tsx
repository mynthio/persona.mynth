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
import { Kbd } from "@nextui-org/kbd";
import Link from "next/link";
import { TextGenerationModel } from "@/lib/ai/text-generation-models/text-generation-model.abstract";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";
type Props = {
  chatId: string;
  personaName: string;
  personaId: string;
  model: TextGenerationModelsEnum;
  userCharacter: {
    name: string;
    character: string;
  };
  personaImageUrl: string | null;
  initialMessages: Message[];
};

function formatString(input: string): string {
  return input
    .replace(/\*(.*?)\*/g, "<i class='text-blue-300'>$1</i>")
    .replace(/"(.*?)"/g, '<b class="text-yellow-300">$1</b>');
}

export default function Chat({
  chatId,
  personaName,
  personaImageUrl,
  initialMessages,
  personaId,
  model,
  userCharacter,
}: Props) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const { user } = useUser();

  const [messages, setMessages] =
    React.useState<CoreMessage[]>(initialMessages);

  const { handleSubmit, register, reset, formState } = useForm<{
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
              <div
                dangerouslySetInnerHTML={{
                  __html: formatString(m.content.toString()),
                }}
              ></div>
            </CardBody>

            <CardFooter>
              {m.role === "user" ? (
                <User
                  name={userCharacter?.name || user?.username}
                  avatarProps={{
                    src: user?.imageUrl,
                  }}
                />
              ) : (
                <User
                  as={Link}
                  href={`/library/personas/${personaId}`}
                  name={personaName}
                  avatarProps={{
                    src: personaImageUrl || "",
                  }}
                />
              )}
            </CardFooter>
          </Card>
        )
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit(async (data) => {
          const newMessages: CoreMessage[] = [
            { content: data.content, role: "user" },
          ];

          const result = await chatAction({
            messages: newMessages,
            chatId: chatId,
          });

          reset();

          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...messages,
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
          onKeyDown={(event) => {
            if (event.metaKey && event.key === "Enter" && formRef.current) {
              formRef.current.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
              );
            }
          }}
        />

        <div className="mt-4 flex items-center gap-4">
          <Button
            isLoading={formState.isSubmitting}
            variant="shadow"
            color="secondary"
            type="submit"
            endContent={
              <Kbd keys={["command", "enter"]} className="bg-default-50/30" />
            }
          >
            Send
          </Button>
          <p className="flex items-center gap-2 text-small text-foreground-500">
            <s>1 token cost</s> 0 token cost (limited time) <Coins size={12} />
          </p>
        </div>
      </form>
    </div>
  );
}
