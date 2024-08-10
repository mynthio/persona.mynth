"use client";

import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { PropsOf } from "@nextui-org/system";
import GenerateImageForm from "./generate-image-form.client";

type Props = PropsOf<typeof Button> & {
  personaId: string;
};

export default function GenerateImageButton({ personaId, ...props }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button {...props} onPress={onOpen}>
        {props.children}
      </Button>

      <Modal
        scrollBehavior="outside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="max-w-4xl p-20"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-4xl font-thin text-foreground-500">
                Generate Persona image
              </ModalHeader>
              <ModalBody className="mt-8">
                <GenerateImageForm personaId={personaId} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
