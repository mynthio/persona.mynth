"use client";

import { generatePersonasAction } from "@/app/_actions/generate-personas.action";
import {
  type GeneratePersonas,
  GeneratePersonasSchema,
} from "@/schemas/generate-personas.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Slider } from "@nextui-org/slider";
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GeneratePersonas>({
    resolver: superstructResolver(GeneratePersonasSchema),
    defaultValues: {
      generateImage: true,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await generatePersonasAction(data);
        refresh();
      })}
      className="grid grid-cols-1 items-center sm:grid-cols-1 gap-4"
    >
      <input type="hidden" value={promptId} {...register("promptId")} />
      {/* <div>
        <Input
          isInvalid={!!errors.batchSize}
          errorMessage={errors.batchSize?.message?.toString() || "Uknown error"}
          label="Batch Size"
          type="number"
          max={4}
          min={1}
          defaultValue="1"
          {...register("batchSize", {
            valueAsNumber: true,
          })}
        />
      </div> */}

      <Slider
        size="lg"
        step={1}
        color="secondary"
        label="Number of personas to generate"
        showSteps={true}
        maxValue={4}
        minValue={2}
        defaultValue={2}
        className="w-full"
        onChange={(value) =>
          setValue("batchSize", Array.isArray(value) ? value[0] : value)
        }
        marks={[
          {
            value: 2,
            label: "2",
          },
          {
            value: 3,
            label: "3",
          },
          {
            value: 4,
            label: "4",
          },
        ]}
      />

      <div>
        <Button
          disabled={isSubmitting}
          isDisabled={isSubmitting}
          type="submit"
          size="lg"
          variant="shadow"
          color="secondary"
          className="ml-auto"
        >
          Generate {isSubmitting ? "..." : ""}
        </Button>
      </div>
    </form>
  );
}
