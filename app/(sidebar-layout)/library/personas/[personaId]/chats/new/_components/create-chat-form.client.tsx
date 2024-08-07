"use client";

import { createChatAction } from "@/app/_actions/create-chat.action";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";
import { CreateChatData, CreateChatSchema } from "@/schemas/create-chat.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type Props = {
  personaId: string;
};

const exampleScenarios = {
  stuck_in_space: {
    chat_name: "Stuck in space",
    scenario:
      "{{persona}} and {{user}} are stuck in a spaceship. There was a technical problem with the ship. Now they need to figure out how to fix it and come back to the earth.",
    model: TextGenerationModelsEnum.MetaLlama3_70bInstruct,
    user_name: "John",
    user_character:
      "{{user}}, 23 years old, space traveler. {{persona}} close friend. They met each other in work, before a travel to space.",
  },
};

const modelsData: {
  id: TextGenerationModelsEnum;
  name: string;
  description: string;
  chip?: string;
}[] = [
  {
    id: TextGenerationModelsEnum.MetaLlama3_70bInstruct,
    name: "Llama 3 70b",
    description: "Good roleplay for general chats",
  },
  {
    id: TextGenerationModelsEnum.Qwen2_72bInstruct,
    name: "Qwen 2 72b",
    description:
      "Good creativity when it comes to Persona character in scneario",
  },
  {
    id: TextGenerationModelsEnum.Sao10kL3_70bEuryaleV2,
    name: "Sao 10k L3 70b",
    chip: "NSFW",
    description: "Greate model for NSFW chats, performs well in roleplay",
  },
];

export default function CreateChatForm({ personaId }: Props) {
  const { push } = useRouter();

  const { handleSubmit, register, control, formState, setValue, reset } =
    useForm<CreateChatData>({
      resolver: superstructResolver(CreateChatSchema),
      defaultValues: {
        personaId,
        name: "New chat",
        model: TextGenerationModelsEnum.MetaLlama3_70bInstruct,
      },
    });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { id } = await createChatAction(data);

        push(`/library/personas/${personaId}/chats/${id}`);
      })}
      className="space-y-4"
    >
      <Select
        label="Scenario Templates"
        onSelectionChange={(key) => {
          const selectedTemplate = exampleScenarios[key.currentKey];
          if (!selectedTemplate) return;

          reset({
            personaId,
            name: selectedTemplate.chat_name,
            scenario: selectedTemplate.scenario,
            model: selectedTemplate.model,
            userName: selectedTemplate.user_name,
            userCharacter: selectedTemplate.user_character,
          });
        }}
      >
        <SelectItem key="stuck_in_space" value="stuck_in_space">
          Stuck in space
        </SelectItem>
      </Select>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            {...field}
            isInvalid={!!formState.errors.name}
            errorMessage={formState.errors.name?.message}
            label="Name"
            description="Your chat name (just for you)"
          />
        )}
      />

      <Controller
        control={control}
        name="model"
        render={({ field }) => (
          <Select
            {...field}
            onSelectionChange={(key) => {
              field.onChange(key.currentKey);
            }}
            isInvalid={!!formState.errors.model}
            errorMessage={formState.errors.model?.message}
            items={modelsData}
            label="Model"
            selectionMode="single"
            description="The AI model that will be used to generate the messages"
            renderValue={([modelData]) =>
              modelData ? (
                <>
                  {modelData.data?.name}
                  {modelData.data?.chip && (
                    <Chip
                      size="sm"
                      className="bg-gradient-to-tl from-purple-700 to-red-600 ml-2"
                    >
                      {modelData.data?.chip}
                    </Chip>
                  )}
                </>
              ) : null
            }
          >
            {(modelData) => (
              <SelectItem
                key={modelData.id}
                value={modelData.id}
                className="py-4"
              >
                {modelData.name}
                {modelData.chip && (
                  <Chip
                    size="sm"
                    className="bg-gradient-to-tl from-purple-700 to-red-600 ml-2"
                  >
                    NSFW
                  </Chip>
                )}
                <p className="text-small text-foreground-500">
                  {modelData.description}
                </p>
              </SelectItem>
            )}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="scenario"
        render={({ field }) => (
          <Textarea
            {...field}
            label="Scenario"
            description="The scenario"
            isInvalid={!!formState.errors.scenario}
            errorMessage={formState.errors.scenario?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="userName"
        render={({ field }) => (
          <Input
            {...field}
            label="User name"
            description="Your name in chat"
            isInvalid={!!formState.errors.userName}
            errorMessage={formState.errors.userName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="userCharacter"
        render={({ field }) => (
          <Textarea
            {...field}
            isInvalid={!!formState.errors.userCharacter}
            errorMessage={formState.errors.userCharacter?.message}
            label="User character"
            description="Your Persona in chat, how AI will see you."
            placeholder="John, 23 years old, living in london. {{character}} friend."
          />
        )}
      />

      <Button type="submit" className="mt-4">
        Create chat
      </Button>
    </form>
  );
}
