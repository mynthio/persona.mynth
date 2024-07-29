"use client";

import { updatePersonaAction } from "@/app/_actions/update-persona.action";
import {
  UpdatePersonaInput,
  UpdatePersonaSchema,
} from "@/schemas/update-persona.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { ListboxItem } from "@nextui-org/listbox";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Switch } from "@nextui-org/switch";
import { PropsOf } from "@nextui-org/system";
import { Earth, Globe } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = PropsOf<typeof Button> & {
  personaId: string;
};

export default function PublishPersonaButton({ personaId, ...props }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePersonaInput>({
    resolver: superstructResolver(UpdatePersonaSchema),
    defaultValues: {
      isNsfw: false,
      published: true,
      personaId,
    },
  });

  return (
    <>
      <Button {...props} onPress={onOpen} isLoading={isSubmitting}>
        {props.children}
      </Button>

      <Modal
        // backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: "bg-default-100/60 dark:bg-transparent shadow-none",
          backdrop: "dark:bg-gradient-to-t from-black to-purple-950/80",
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
                    <Switch title="is NSFW?" {...register("isNsfw")}>
                      is NSFW?
                    </Switch>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="flat"
                    startContent={<Earth size={16} />}
                  >
                    Publish
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
