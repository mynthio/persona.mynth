"use client";

import { createPersonaAction } from "@/app/_actions/create-persona.action";
import {
  CreatePersonaData,
  CreatePersonaSchema,
} from "@/schemas/create-persona.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function NewPersonaForm() {
  const { push } = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
  } = useForm<CreatePersonaData>({
    resolver: superstructResolver(CreatePersonaSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const persona = await createPersonaAction(data);

        push(`/library/personas/${persona.id}`);
      })}
      className="max-w-xl space-y-4"
    >
      {/* Gender */}
      <Select {...register("gender")} label="Gender" isRequired>
        <SelectItem key="male" value="male">
          Male
        </SelectItem>
        <SelectItem key="female" value="female">
          Female
        </SelectItem>
        <SelectItem key="other" value="other">
          Other
        </SelectItem>
      </Select>

      {/* Name */}
      <Input
        {...register("name")}
        label="Name"
        placeholder="Persona name"
        isRequired
        maxLength={125}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />

      {/* Age */}
      <Input
        {...register("age")}
        label="Age"
        placeholder="Persona age"
        isRequired
        maxLength={30}
        isInvalid={!!errors.age}
        errorMessage={errors.age?.message}
      />

      {/* Appearance */}
      <Textarea
        {...register("appearance")}
        label="Appearance"
        placeholder="Persona appearance"
        isRequired
        maxLength={1000}
        isInvalid={!!errors.appearance}
        errorMessage={errors.appearance?.message}
      />

      {/* Style */}
      <Textarea
        {...register("style")}
        label="Style"
        placeholder="Persona style"
        isRequired
        maxLength={1000}
        isInvalid={!!errors.style}
        errorMessage={errors.style?.message}
      />

      {/* Background */}
      <Textarea
        {...register("background")}
        label="Background"
        placeholder="Persona background"
        isRequired
        maxLength={1000}
        isInvalid={!!errors.background}
        errorMessage={errors.background?.message}
      />

      {/* History */}
      <Textarea
        {...register("history")}
        label="History"
        placeholder="Persona history"
        isRequired
        maxLength={1000}
        isInvalid={!!errors.history}
        errorMessage={errors.history?.message}
      />

      {/* Characteristics */}
      <Textarea
        {...register("characteristics")}
        label="Characteristics"
        placeholder="Persona characteristics"
        isRequired
        maxLength={1000}
        isInvalid={!!errors.characteristics}
        errorMessage={errors.characteristics?.message}
      />

      {/* Personality traits */}
      <Textarea
        {...register("personalityTraits")}
        label="Personality traits"
        placeholder="Persona personality traits"
        isRequired
        maxLength={1000}
        isInvalid={!!errors.personalityTraits}
        errorMessage={errors.personalityTraits?.message}
      />

      {/* Interests */}
      <Textarea
        {...register("interests")}
        label="Interests"
        placeholder="Persona interests"
        isRequired
        maxLength={1000}
        isInvalid={!!errors.interests}
        errorMessage={errors.interests?.message}
      />

      {/* Occupation */}
      <Input
        {...register("occupation")}
        label="Occupation"
        placeholder="Persona occupation"
        isRequired
        maxLength={255}
        isInvalid={!!errors.occupation}
        errorMessage={errors.occupation?.message}
      />

      {/* Summary */}
      <Textarea
        {...register("summary")}
        label="Summary"
        placeholder="Persona summary"
        description="Used on Persona cards"
        isRequired
        maxLength={255}
        isInvalid={!!errors.summary}
        errorMessage={errors.summary?.message}
      />

      {/* Is nsfw */}
      <div>
        <Controller
          defaultValue={false}
          control={control}
          name="isNsfw"
          render={({ field }) => (
            <Switch onValueChange={(value) => field.onChange(value)}>
              Is NSFW?
            </Switch>
          )}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Create
      </Button>

      <p className="text-small text-foreground-500">
        You can add and generate images after creating the persona.
      </p>
    </form>
  );
}
