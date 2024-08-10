"use client";

import { generatePersonaImageAction } from "@/app/_actions/generate-persona-image.action";
import { PersonaImageQualityEnum } from "@/enums/persona-image-quality.enum";
import { PersonaImageStyleEnum } from "@/enums/persona-image-style.enum";
import {
  GeneratePersonaImageData,
  GeneratePersonaImageSchema,
} from "@/schemas/generate-persona-image.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";
import { User } from "@nextui-org/user";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { Radio, RadioGroup } from "@nextui-org/radio";

import { useSearchParams, useRouter } from "next/navigation";
import { useImageGenerations } from "@/app/_stores/image-generations.store";
import { Image } from "@nextui-org/image";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { PersonaImageFrameEnum } from "@/enums/persona-image-frame.enum";

type Props = {
  personaId: string;
  onClose: () => void;
};

const qualityCosts = {
  [PersonaImageQualityEnum.High]: 5,
  [PersonaImageQualityEnum.Medium]: 1,
};

const personaImageStylesData = [
  {
    id: PersonaImageStyleEnum.Photorealistic,
    name: "Photorealistic",
    description: "Suggested for realistic personas",
    imageUrl: "https://cdn.persona.mynth.io/ENl4l9TUumqg.webp",
  },
  {
    id: PersonaImageStyleEnum.Anime,
    name: "Anime",
    description: "Creates anime-style art",
    imageUrl: "https://cdn.persona.mynth.io/NzpVG-XV0O_7.webp",
  },
];

const personaImageQualitiesData = [
  {
    id: PersonaImageQualityEnum.High,
    name: (
      <>
        High Quality{" "}
        <Chip color="primary" size="sm" className="text-[10px] p-0.5">
          10 tokens / image
        </Chip>
      </>
    ),

    description:
      "High quality, better models, slower generation speed, more expensive. Coming soon",
    x: "HQ",
  },
  {
    id: PersonaImageQualityEnum.Medium,
    name: (
      <>
        Medium Quality{" "}
        <Chip color="primary" size="sm" className="text-[10px] p-0.5">
          1 token / image
        </Chip>
      </>
    ),
    description: "Medium quality, faster generation speed, less tokens",
    x: "MQ",
  },
];

const personaImageFramesData = [
  {
    id: PersonaImageFrameEnum.Portrait,
    name: "Portrait",
    description: "Creates a portrait image",
    imageUrl: "https://cdn.persona.mynth.io/ZElWYoAI81YW.webp",
  },
  {
    id: PersonaImageFrameEnum.FullBody,
    name: "Full Body",
    description:
      "Creates a full body image (WIP, may produce incorrect results)",
    imageUrl: "https://cdn.persona.mynth.io/ZPmPIipl1ZzU.webp",
  },
];

export default function GenerateImageForm({ personaId, onClose }: Props) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const { formState, control, watch, handleSubmit, register } =
    useForm<GeneratePersonaImageData>({
      resolver: superstructResolver(GeneratePersonaImageSchema),
      defaultValues: {
        personaId,

        style: PersonaImageStyleEnum.Photorealistic,
        frame: PersonaImageFrameEnum.Portrait,
        quality: PersonaImageQualityEnum.Medium,

        batchSize: 1,
      },
    });

  const watchCostFields = watch(["quality", "batchSize"]);

  const cost = React.useMemo(() => {
    const [quality, batchSize] = watchCostFields;

    return qualityCosts[quality] * batchSize;
  }, [watchCostFields]);

  const imageGenerations = useImageGenerations();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const ids = await generatePersonaImageAction(data);

        ids.forEach((id) => {
          imageGenerations.addImageGeneration({
            status: "queued",
            eventId: id,
            personaId: data.personaId,
          });
        });

        onClose();
      })}
    >
      <Select
        selectionMode="single"
        disallowEmptySelection
        classNames={{
          trigger: "min-h-auto py-10",
          listboxWrapper: "max-h-[400px]",
          value: "flex items-center",
        }}
        items={personaImageStylesData}
        {...register("style")}
        renderValue={([item]) =>
          item ? (
            <User
              name={item.data?.name}
              description={item.data?.description}
              classNames={{
                description: "text-foreground-500",
              }}
              avatarProps={{
                className: "rounded-lg",
                src: item.data?.imageUrl,
              }}
            />
          ) : null
        }
      >
        {(item) => (
          <SelectItem key={item.id} value={item.id}>
            <User
              name={item.name}
              description={item.description}
              classNames={{
                description: "text-foreground-500",
              }}
              avatarProps={{
                className: "rounded-lg",
                src: item.imageUrl,
              }}
            />
          </SelectItem>
        )}
      </Select>

      <Select
        selectionMode="single"
        disallowEmptySelection
        className="mt-4"
        classNames={{
          trigger: "min-h-auto py-10",
          listboxWrapper: "max-h-[400px]",
          value: "flex items-center",
        }}
        items={personaImageFramesData}
        {...register("frame")}
        renderValue={([item]) =>
          item ? (
            <User
              name={item.data?.name}
              description={item.data?.description}
              classNames={{
                description: "text-foreground-500",
              }}
              avatarProps={{
                className: "rounded-lg",
                src: item.data?.imageUrl,
              }}
            />
          ) : null
        }
      >
        {(item) => (
          <SelectItem key={item.id} value={item.id}>
            <User
              name={item.name}
              description={item.description}
              classNames={{
                description: "text-foreground-500",
              }}
              avatarProps={{
                className: "rounded-lg",
                src: item.imageUrl,
              }}
            />
          </SelectItem>
        )}
      </Select>

      <Select
        selectionMode="single"
        disallowEmptySelection
        className="mt-4"
        disabledKeys={[PersonaImageQualityEnum.High]}
        classNames={{
          trigger: "min-h-auto py-10",
          listboxWrapper: "max-h-[400px]",
          value: "flex items-center",
        }}
        items={personaImageQualitiesData}
        {...register("quality")}
        renderValue={([item]) =>
          item ? (
            <User
              name={item.data?.name}
              description={item.data?.description}
              classNames={{
                description: "text-foreground-500",
              }}
              avatarProps={{
                className: "rounded-lg",
                name: item.data?.x,
              }}
            />
          ) : null
        }
      >
        {(item) => (
          <SelectItem key={item.id} value={item.id}>
            <User
              name={item.name}
              description={item.description}
              classNames={{
                description: "text-foreground-500",
              }}
              avatarProps={{
                className: "rounded-lg",
                name: item.x,
              }}
            />
          </SelectItem>
        )}
      </Select>

      {/* <Textarea
        {...register("additionalInstructions")}
        placeholder="Additional instructions"
        className="mt-4"
      /> */}

      <h4 className="mt-4 font-light text-foreground-500">
        Number of images to generate
      </h4>
      <div className="relative mt-2">
        <Controller
          name="batchSize"
          control={control}
          render={(props) => (
            <Slider
              onChange={(value) =>
                props.field.onChange(Array.isArray(value) ? value[0] : value)
              }
              onBlur={props.field.onBlur}
              defaultValue={1}
              step={1}
              minValue={1}
              maxValue={4}
              marks={[
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
              ]}
            />
          )}
        />
      </div>

      <div className="text-right mt-20">
        <span className="mr-4 text-foreground-500 text-small">
          Cost: 0 tokens (free while in beta)
        </span>
        <Button type="submit" variant="flat">
          Generate
        </Button>
      </div>
    </form>
  );
}
