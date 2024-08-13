import { Button } from "@nextui-org/button";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { PropsOf } from "@nextui-org/system";
import ChatMessageHistory from "./chat-message-history.client";
import { useRouter } from "next/navigation";

type Props = PropsOf<typeof Button> & {
  messageId: string;
};

export default function ChatMessageHistoryButton({
  messageId,
  ...props
}: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button {...props} onPress={onOpen} />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="max-w-2xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Message versions history
              </ModalHeader>
              <ModalBody>
                <ChatMessageHistory messageId={messageId} />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                  }}
                >
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
