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
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Coins, History, RefreshCcw, Send, Trash } from "lucide-react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import { Kbd } from "@nextui-org/kbd";
import Link from "next/link";
import { TextGenerationModel } from "@/lib/ai/text-generation-models/text-generation-model.abstract";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";
import { regenerateChatMessageAction } from "@/app/_actions/regenerate-chat-message.action";
import { Tooltip } from "@nextui-org/react";
import ChatMessageHistory from "./_components/chat-message-history.client";
import ChatMessageHistoryButton from "./_components/chat-message-history-button.client";
import { deleteChatMessageAction } from "@/app/_actions/delete-chat-message.action";
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

  const [isLoading, setIsLoading] = React.useState(false);

  const { user } = useUser();

  const [messages, setMessages] =
    React.useState<CoreMessage[]>(initialMessages);

  const { handleSubmit, register, reset, formState } = useForm<{
    content: string;
  }>();

  return (
    <div className="space-y-4">
      {messages.map((m, mi) =>
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
                <div className="flex items-start justify-between w-full">
                  <User
                    name={userCharacter?.name || user?.username}
                    avatarProps={{
                      src: user?.imageUrl,
                    }}
                  />

                  {mi === messages.length - 2 && (
                    <Popover placement="right">
                      <PopoverTrigger>
                        <Button
                          variant="light"
                          isLoading={isLoading || formState.isSubmitting}
                          isIconOnly
                        >
                          <Trash size={12} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2">
                          <div className="text-small font-bold">
                            Delete this and answer?
                          </div>
                          <div className="mt-4">
                            <Button
                              onPress={async () => {
                                if (isLoading || formState.isSubmitting) return;
                                setIsLoading(true);
                                await deleteChatMessageAction({
                                  messageId: m.id,
                                  chatId: chatId,
                                });

                                // Remove last 2 messages
                                setMessages([
                                  ...messages.slice(0, messages.length - 2),
                                ]);

                                setIsLoading(false);
                              }}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ) : (
                <div className="flex items-start justify-between w-full">
                  <User
                    as={Link}
                    href={`/library/personas/${personaId}`}
                    name={personaName}
                    avatarProps={{
                      src: personaImageUrl || "",
                    }}
                  />

                  <div>
                    {mi === messages.length - 1 && (
                      <Tooltip content="Regenerate last message">
                        <Button
                          variant="light"
                          isLoading={isLoading || formState.isSubmitting}
                          isIconOnly
                          onClick={async () => {
                            if (isLoading || formState.isSubmitting) return;
                            setIsLoading(true);

                            const result = await regenerateChatMessageAction({
                              chatId: chatId,
                            });

                            const messagesWithoutLastOne = messages.slice(
                              0,
                              messages.length - 1
                            );

                            for await (const content of readStreamableValue(
                              result
                            )) {
                              setMessages([
                                ...messagesWithoutLastOne,
                                {
                                  role: "assistant",
                                  content: content as string,
                                },
                              ]);
                            }

                            setIsLoading(false);
                          }}
                        >
                          <RefreshCcw size={12} />
                        </Button>
                      </Tooltip>
                    )}
                    <ChatMessageHistoryButton
                      isIconOnly
                      variant="light"
                      messageId={m.id}
                    >
                      <History size={12} />
                    </ChatMessageHistoryButton>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        )
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit(async (data) => {
          const result = await chatAction({
            content: data.content,
            chatId: chatId,
          });

          const newMessages: CoreMessage[] = [
            {
              id: result.userMessage.id,
              content: data.content,
              role: "user",
            } as any,
          ];

          reset();

          for await (const content of readStreamableValue(result.textStream)) {
            setMessages([
              ...messages,
              ...newMessages,
              {
                id: result.assistantMessage.id,
                role: "assistant",
                content: content as string,
              } as any,
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

        <div className="mt-4 flex items-center gap-4"></div>
      </form>
    </div>
  );
}
