"use client";

import { createPromptAction } from "@/app/_actions/create-prompt.action";
import { TextPromptSchema } from "@/schemas/create-prompt.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function PromptTextPromptForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    reValidateMode: "onChange",
    resolver: superstructResolver(TextPromptSchema),
  });

  const { push } = useRouter();

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
      onSubmit={handleSubmit(async (data) => {
        if (isSubmitting) return;
        const { personaPromptId } = await createPromptAction(data);
        push(`/library/prompts/${personaPromptId}`);
      })}
    >
      <p className="mt-1 text-foreground-500 text-small max-w-xl text-balance">
        Write character information that will be used to generate persona, it
        can be short or long, missing details will be generated.
      </p>

      <div className="col-span-full">
        <Textarea
          {...register("textPrompt")}
          fullWidth
          isInvalid={!!errors.textPrompt}
          errorMessage={
            errors.textPrompt?.message?.toString() || "Uknown error"
          }
          placeholder="a woman, around 20 years old, student, long hairs, playing tennis"
          description="Write character information that will be used to generate persona"
        />
      </div>

      <div>
        <Button
          type="submit"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          Save
        </Button>
        <p className="text-small text-foreground-500 mt-2">
          After that you can start generating personas based on this prompt
        </p>
      </div>
    </form>
  );
}
