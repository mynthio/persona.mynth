"use client";

import { updatePersonaAction } from "@/app/_actions/update-persona.action";
import { UpdatePersonaSchema } from "@/schemas/update-persona.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Switch } from "@nextui-org/switch";
import { Globe } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  personaId: string;
};

export default function PublishPersonaButton({ personaId }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: superstructResolver(UpdatePersonaSchema),
  });

  return (
    <>
      <Button
        variant="ghost"
        onPress={onOpen}
        endContent={<Globe size={16} />}
        className="w-full"
      >
        Publish
      </Button>
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
                      value={personaId}
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
    </>
  );
}
