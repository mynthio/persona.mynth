"use client";

import { deleteImageAction } from "@/app/_actions/delete-image.action";
import { updateImageAction } from "@/app/_actions/update-image.action";
import { updatePersonaAction } from "@/app/_actions/update-persona.action";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import { Earth, Trash } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";

export default function ImageModal() {
  const params = useParams<{
    personaId: string;
  }>();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const imageId = searchParams.get("image")?.toString();

  const { data, isLoading, mutate } = useSWR(
    imageId ? `/api/images/${imageId}` : null
  );

  return (
    <Modal
      isOpen={searchParams.has("image")}
      onClose={() => push("?")}
      className="max-w-3xl relative min-h-[75%]"
    >
      <ModalContent className="relative">
        {(onClose) => (
          <>
            <ModalBody className="w-1/2 ml-auto">
              <div className="flex flex-wrap gap-2 mt-10">
                {data?.image?.ai === true ? (
                  <Chip color="primary" size="sm">
                    AI
                  </Chip>
                ) : null}

                {data?.image?.labels.map((label) => (
                  <Chip key={label} color="primary" size="sm">
                    {label}
                  </Chip>
                ))}
              </div>

              <div className="mt-1">
                <p className="text-foreground-500">
                  Prompt: {data?.image?.prompt}
                </p>
              </div>

              <div className="mt-1">
                <p className="text-foreground-500">
                  Model: {data?.image?.model}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 mb-2">
                <Switch
                  defaultSelected={data?.image?.public}
                  onValueChange={async (value) => {
                    toast.promise(
                      updateImageAction({
                        imageId: data?.image?.id,
                        public: value,
                      }).then(() => mutate()),
                      {
                        loading: "Setting public status...",
                        success: "Public status set!",
                        error: "Failed to set public status",
                      }
                    );
                  }}
                  classNames={{
                    label: "flex items-center gap-2",
                  }}
                >
                  <Earth size={16} />
                </Switch>

                <div className="flex items-center gap-2">
                  <Button
                    onPress={async () => {
                      toast("Delete image?", {
                        action: {
                          label: "Delete",
                          onClick: async () => {
                            await deleteImageAction({
                              imageId: data?.image?.id,
                            });
                          },
                        },
                      });
                    }}
                    isIconOnly
                    color="danger"
                    variant="light"
                  >
                    <Trash size={16} />
                  </Button>
                  <Button
                    onPress={async () => {
                      toast.promise(
                        updatePersonaAction({
                          personaId: params.personaId,
                          mainImageUrl: data?.image?.imageUrl,
                        }),
                        {
                          loading: "Setting main image...",
                          success: "Main image set!",
                          error: "Failed to set main image",
                        }
                      );
                    }}
                    variant="flat"
                  >
                    Set as main image
                  </Button>
                </div>
              </div>
            </ModalBody>

            <Image
              classNames={{
                img: "rounded-none h-full object-cover",
                wrapper: "absolute top-0 left-0 bottom-0 right-1/2",
              }}
              src={data?.image?.imageUrl}
              alt={data?.image?.imageUrl}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
