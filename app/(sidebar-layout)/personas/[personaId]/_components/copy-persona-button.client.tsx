"use client";

import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { PropsOf } from "@nextui-org/system";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useForm } from "react-hook-form";
import { CopyPersonaInput } from "@/schemas/copy-persona.schema";
import { copyPersonaAction } from "@/app/_actions/copy-persona.action";
import { useRouter } from "next/navigation";

type Props = PropsOf<typeof Button> & {
  personaId: string;
};

export default function CopyPersonaButton({ personaId, ...props }: Props) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CopyPersonaInput>({
    defaultValues: {
      personaId,
    },
  });

  const { push } = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button {...props} onPress={onOpen}>
        {props.children}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={handleSubmit(async (data) => {
                const { copiedPersonaId } = await copyPersonaAction({
                  personaId: data.personaId,
                });

                push(`/library/personas/${copiedPersonaId}`);
              })}
            >
              <ModalHeader className="flex flex-col gap-1">
                Copy Persona
              </ModalHeader>
              <ModalBody>
                <p>
                  To be able to interact with public personas, we've added a
                  feature to copy them to your library.
                </p>

                <p>
                  This way the personas will be available for you, even if
                  author decides to unpublish or delete them.
                </p>

                <p>
                  Copied personas currently cannot be published again. In future
                  we may think of some option, if there's suficcient percent of
                  changes made to persona.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                  Copy
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
