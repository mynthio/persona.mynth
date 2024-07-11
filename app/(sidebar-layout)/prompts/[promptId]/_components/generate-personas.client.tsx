"use client";

import { generatePersonasAction } from "@/app/_actions/generate-personas.action";
import {
  type GeneratePersonas,
  GeneratePersonasSchema,
} from "@/schemas/generate-personas.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Props = {
  promptId: string;
};

export default function GeneratePersonas({ promptId }: Props) {
  const { refresh } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneratePersonas>({
    resolver: superstructResolver(GeneratePersonasSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log("START");
        await generatePersonasAction(data);
        console.log("END");
        refresh();
      })}
      className="grid grid-cols-1 items-center sm:grid-cols-2 gap-4"
    >
      <input
        className="col-span-full"
        type="hidden"
        value={promptId}
        {...register("promptId")}
      />
      <div>
        <Switch {...register("generateImage")}>Generate Images</Switch>
      </div>
      <div>
        <Input
          isInvalid={!!errors.batchSize}
          errorMessage={errors.batchSize?.message?.toString() || "Uknown error"}
          label="Batch Size"
          type="number"
          max={2}
          min={1}
          defaultValue="1"
          {...register("batchSize", {
            valueAsNumber: true,
          })}
        />
      </div>
      <div>
        <Button disabled={isSubmitting} isDisabled={isSubmitting} type="submit">
          Generate {isSubmitting ? "..." : ""}
        </Button>
      </div>
    </form>
  );
}
