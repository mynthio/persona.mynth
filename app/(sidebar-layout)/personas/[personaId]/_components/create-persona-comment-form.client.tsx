"use client";

import { createPersonaCommentAction } from "@/app/_actions/create-persona-comment.action";
import {
  CreatePersonaCommentInput,
  CreatePersonaCommentSchema,
} from "@/schemas/create-persona-comment.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

type Props = {
  personaId: string;
};

export default function CreatePersonaCommentForm({ personaId }: Props) {
  const searchParams = useSearchParams();
  const { mutate } = useSWRConfig();

  const { register, handleSubmit, formState } =
    useForm<CreatePersonaCommentInput>({
      resolver: superstructResolver(CreatePersonaCommentSchema),
      defaultValues: {
        personaId,
      },
    });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { comment } = await createPersonaCommentAction(data);
        mutate<{ comments: any[] }>(
          `/api/personas/${personaId}/comments?cursor=${
            searchParams.get("cursor") || ""
          }&direction=${searchParams.get("direction") || "next"}`,
          (data) => {
            return data
              ? {
                  comments: [comment, ...data.comments],
                }
              : { comments: [comment] };
          },
          {
            revalidate: false,
          }
        );
      })}
    >
      <Textarea
        {...register("content")}
        placeholder="Add a comment"
        className="w-full"
        errorMessage={formState.errors.content?.message}
      />
      <Button
        type="submit"
        className="w-full mt-2"
        variant="shadow"
        isDisabled={formState.isSubmitting}
        isLoading={formState.isSubmitting}
      >
        Add
      </Button>
    </form>
  );
}
