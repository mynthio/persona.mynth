"use client";

import { cn } from "@/lib/utils";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Checkbox } from "@nextui-org/checkbox";
import { Switch } from "@nextui-org/switch";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  CreatePersonaChatInput,
  CreatePersonaChatSchema,
} from "@/schemas/create-persona-chat";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Chip } from "@nextui-org/chip";
import { createPersonaChatAction } from "@/app/_actions/create-persona-chat.action";
import { useRouter } from "next/navigation";

type Props = {
  personaId: string;
};

export default function NewChatButton({ personaId }: Props) {
  const { push } = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { control, handleSubmit, formState } = useForm<CreatePersonaChatInput>({
    resolver: superstructResolver(CreatePersonaChatSchema),
    defaultValues: {
      personaId,
    },
  });

  return (
    <>
      <Button endContent={<Plus size={12} />} variant="light" onClick={onOpen}>
        Start new chat
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="max-w-xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form
                onSubmit={handleSubmit(async (data) => {
                  const { id } = await createPersonaChatAction(data);

                  push(`/library/personas/${personaId}/chats/${id}`);
                })}
              >
                <ModalHeader className="flex flex-col gap-1">
                  Start new chat with Persona
                </ModalHeader>

                <ModalBody>
                  {/* 

                TODO: Consider local chats as a feature, but for some reasons
                now I don't want to implement it. Managing local chats, plus localStorage
                limits seems kinda blockers, maybe better to build some native web based app
                and use normal storage.
                
                <div>
                  <Switch
                    classNames={{
                      base: cn(
                        "inline-flex flex-row-reverse w-full bg-content1 hover:bg-content2 items-center",
                        "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary"
                      ),
                      wrapper: "p-0 h-4 overflow-visible",
                      thumb: cn(
                        "w-6 h-6 border-2 shadow-lg",
                        "group-data-[hover=true]:border-primary",
                        //selected
                        "group-data-[selected=true]:ml-6",
                        // pressed
                        "group-data-[pressed=true]:w-7",
                        "group-data-[selected]:group-data-[pressed]:ml-4"
                      ),
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-medium">Local chat</p>
                      <p className="text-tiny text-default-400">
                        In local chat mode, conversation is not saved in our
                        database. It's stored locally on your machine. Read
                        more.
                      </p>
                    </div>
                  </Switch>
                </div> */}

                  <hr className="border-foreground-100 my-2" />

                  <div>
                    <Checkbox
                      isSelected={true}
                      aria-label="Chat"
                      value="chat"
                      classNames={{
                        base: cn(
                          "inline-flex w-full max-w-full bg-content1 m-0",
                          "hover:bg-content2 items-center justify-start",
                          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                          "data-[selected=true]:border-primary"
                        ),
                        label: "w-full",
                      }}
                    >
                      Chat mode
                    </Checkbox>

                    <Checkbox
                      isDisabled={true}
                      value="roleplay"
                      classNames={{
                        base: cn(
                          "inline-flex w-full max-w-full bg-content1 m-0",
                          "hover:bg-content2 items-center justify-start",
                          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                          "data-[selected=true]:border-primary"
                        ),
                        label: "w-full",
                      }}
                    >
                      Roleplay
                      <p className="text-small">
                        Scenarios, personas... Coming soon
                      </p>
                    </Checkbox>
                  </div>

                  <Chip color="danger" className="mx-auto mt-4">
                    BETA
                  </Chip>
                  <p className="text-center text-balance text-foreground-500 text-small mt-0.5">
                    Chat with Persona is in early beta. We're working hard to
                    make it better. Please report any issues you find.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    isDisabled={formState.isSubmitting}
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={formState.isSubmitting}
                    color="primary"
                    type="submit"
                  >
                    Create
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
