"use client";

import { Listbox, ListboxItem } from "@nextui-org/listbox";
import {
  BookUser,
  Globe,
  Images,
  MessageSquare,
  MessagesSquare,
} from "lucide-react";
import PublishPersonaButton from "./publish-persona-button.client";
import { updatePersonaAction } from "@/app/_actions/update-persona.action";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Switch } from "@nextui-org/switch";
import { register } from "module";
import { UpdatePersonaSchema } from "@/schemas/update-persona.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { useForm } from "react-hook-form";

type Props = {
  personaId: string;
};

export default function PersonaMenu(props: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: superstructResolver(UpdatePersonaSchema),
  });

  return (
    <div className="rounded-xl w-full border-2 border-foreground-200">
      <Listbox>
        <ListboxItem
          startContent={<BookUser size={12} />}
          key="publish"
          href={`/library/personas/${props.personaId}`}
        >
          Persona
        </ListboxItem>
        <ListboxItem
          startContent={<MessagesSquare size={12} />}
          key="chat"
          href={`/library/personas/${props.personaId}/chats`}
        >
          Chats
        </ListboxItem>
        <ListboxItem startContent={<Images size={12} />} key="gallery">
          Gallery
        </ListboxItem>
        <ListboxItem
          onPress={onOpen}
          startContent={<Globe size={12} />}
          key="publish"
        >
          Publish
        </ListboxItem>
      </Listbox>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form
                onSubmit={handleSubmit(async (data) => {
                  await updatePersonaAction(data);
                  onClose();
                })}
              >
                <ModalHeader className="flex flex-col gap-1">
                  Publish Persona?
                </ModalHeader>
                <ModalBody>
                  <p>
                    After publishing, everyone will have access to view and
                    comment on that persona.
                  </p>

                  <p>
                    Please mark this persona as NSFW if it contains nudity or
                    otherwise inappropriate content and let's keep everyone
                    happy :)
                  </p>

                  <div>
                    <input
                      type="hidden"
                      {...register("personaId")}
                      value={props.personaId}
                    />
                  </div>

                  <div>
                    <input
                      type="hidden"
                      placeholder="Persona name"
                      {...register("published", {
                        value: true,
                      })}
                    />
                  </div>

                  <div>
                    <Switch title="is NSFW?" {...register("isNsfw")}>
                      is NSFW?
                    </Switch>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary">
                    Publish
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
