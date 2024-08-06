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
import { Input } from "@nextui-org/input";
import { uploadPersonaImageAction } from "@/app/_actions/upload-persona-image.action";
import { Controller, useForm } from "react-hook-form";

type Props = PropsOf<typeof Button> & {
  personaId: string;
};

export default function UploadImageButton({ personaId, ...props }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    handleSubmit,
    formState: { isSubmitting },
    register,
    control,
  } = useForm<{
    image: File;
    personaId: string;
  }>({
    defaultValues: {
      personaId: personaId,
    },
  });

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
                Upload Persona image
              </ModalHeader>
              <ModalBody className="mt-8">
                <form
                  onSubmit={handleSubmit(async (values) => {
                    const formData = new FormData();
                    formData.append("image", values.image);
                    formData.append("personaId", values.personaId);

                    await uploadPersonaImageAction(formData).then(() => {
                      onClose();
                    });
                  })}
                >
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="file"
                        description="Max file size: 4.5MB"
                        accept="image/*"
                        className="w-full"
                        onChange={(event) => {
                          field.onChange(event.target.files?.[0]);
                        }}
                        value={field.value?.fileName}
                      />
                    )}
                  />

                  <Button
                    className="mt-4"
                    type="submit"
                    variant="flat"
                    isLoading={isSubmitting}
                  >
                    Upload
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
