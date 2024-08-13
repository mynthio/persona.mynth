import { selectChatMessageVersionAction } from "@/app/_actions/select-chat-message-version.action";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { PropsOf } from "@nextui-org/system";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

function formatString(input: string): string {
  return input
    .replace(/\*(.*?)\*/g, "<i class='text-blue-300'>$1</i>")
    .replace(/"(.*?)"/g, '<b class="text-yellow-300">$1</b>');
}

type Props = {
  messageId: string;
};

export default function ChatMessageHistory({ messageId }: Props) {
  const params = useParams();
  const { data, isLoading, mutate } = useSWR<{
    data: {
      id: string;
      selected: boolean;
      content: string;
      role: string;
      version: number;
    }[];
  }>(`/api/chat/message/${messageId}/versions`);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>No data</div>;

  return (
    <div className="space-y-4">
      {data.data.map((m) => (
        <Card key={m.id} className="bg-default-50/20">
          <CardBody>
            <p
              dangerouslySetInnerHTML={{
                __html: formatString(m.content.toString()),
              }}
            />
          </CardBody>

          <CardFooter className="justify-end">
            {m.selected ? (
              <Button size="sm" variant="flat" isDisabled>
                selected
              </Button>
            ) : (
              <Button
                size="sm"
                variant="flat"
                onPress={async () => {
                  await selectChatMessageVersionAction({
                    messageId: messageId,
                    versionId: m.id,
                  });

                  mutate();
                }}
              >
                Select version
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
