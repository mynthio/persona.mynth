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
import { Link } from "@nextui-org/react";

export default function PersonaChat() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Chat with persona</Button>
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
              <ModalHeader className="flex flex-col gap-1">
                You found a feature that is not yet implemented!
              </ModalHeader>
              <ModalBody>
                <p>
                  Do you like the idea of chatting with created personas? We bet
                  you do! 😁
                </p>
                <p>
                  Join our Discord server and let us know what you think. Also
                  you can vote there on your favorite features, so we can
                  prioritize them.
                </p>

                <Button
                  as={Link}
                  href="https://discord.gg/By5AnDQDTQ"
                  target="_blank"
                >
                  Join Discord
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
