"use client";

import { createPromptAction } from "@/app/_actions/create-prompt.action";
import {
  CreatePromptSchema,
  CreatorPrompt,
  CreatorPromptSchema,
} from "@/schemas/create-prompt.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input, Textarea } from "@nextui-org/input";
import { Link } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Eraser, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { assert } from "superstruct";

const predefinedAges = [
  { value: "5-12", label: "Child (5-12)", nsfwVisible: false },
  {
    value: "13-17",
    label: "Teenager (13-17)",
    min: 13,
    max: 17,
  },
  {
    value: "18-24",
    label: "Young Adult (18-24)",
    min: 18,
    max: 24,
  },
  {
    value: "25-34",
    label: "Adult (25-34)",
    min: 25,
    max: 34,
  },
  {
    value: "35-44",
    label: "Middle Aged (35-44)",
    min: 35,
    max: 44,
  },
  {
    value: "45-54",
    label: "Senior (45-54)",
    min: 45,
    max: 54,
  },
  {
    value: "55+",
    label: "Elderly (55+)",
    min: 55,
    max: 100,
  },
];

const predefinedOccupations = [
  "doctor",
  "teacher",
  "engineer",
  "lawyer",
  "artist",
  "writer",
  "programmer",
  "chef",
  "manager",
  "nurse",
  "accountant",
  "analyst",
  "designer",
  "developer",
  "entrepreneur",
  "investor",
  "journalist",
  "politician",
  "scientist",
  "soldier",
  "psychologist",
];

const predefinedPersonalityTraits = [
  "Adventurous",
  "Agreeable",
  "Ambitious",
  "Analytical",
  "Artistic",
  "Assertive",
  "Authentic",
  "Bold",
  "Brave",
  "Calm",
  "Careful",
  "Cautious",
  "Charismatic",
  "Cheerful",
  "Compassionate",
  "Confident",
  "Conscientious",
  "Creative",
  "Curious",
  "Diligent",
  "Disciplined",
  "Dynamic",
  "Eager",
  "Elegant",
  "Emotional",
  "Energetic",
  "Enthusiastic",
  "Excited",
  "Experienced",
  "Faithful",
  "Flexible",
  "Focused",
  "Friendly",
  "Gentle",
  "Graceful",
  "Gritty",
  "Hardworking",
  "Humble",
  "Humorous",
  "Idealistic",
];

const predefinedBackgrounds = ["urban", "suburban", "rural", "international"];

const predefinedEducationLevels = [
  "high school",
  "bachelor",
  "master",
  "PhD",
  "self-taught",
];

const predefinedHobbies = [
  "reading",
  "sports",
  "cooking",
  "travel",
  "music",
  "gaming",
  "photography",
  "gardening",
  "technology",
  "arts and crafts",
];

const predefinedCulturalBackgrounds = [
  "western",
  "eastern",
  "african",
  "latin american",
  "middle eastern",
  "multicultural",
];

const predefinedRelationships = [
  "single",
  "in a relationship",
  "married",
  "divorced",
  "widowed",
];

export default function PromptCreatorForm() {
  const { push } = useRouter();

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreatorPrompt>({
    resolver: superstructResolver(CreatorPromptSchema),
    defaultValues: {
      gender: "random",
    },
  });

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      onSubmit={handleSubmit(async (data) => {
        if (isSubmitting) return;
        const { personaPromptId } = await createPromptAction(data);
        push(`/library/prompts/${personaPromptId}`);
      })}
    >
      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Settings</h3>
      </div>

      <div>
        <Select
          {...register("style")}
          label="Persona style"
          errorMessage={errors.style?.message}
          defaultSelectedKeys={["realistic"]}
          description="What kind of persona would you like to generate?"
        >
          <SelectItem key="realistic">Realistic</SelectItem>
          <SelectItem key="fantasy">Fantasy</SelectItem>
          <SelectItem key="random">Random</SelectItem>
        </Select>
      </div>

      {/* <div>
        <Select
          {...register("generationStyle")}
          label="Generation Style"
          defaultSelectedKeys={["detailed_realistic"]}
          errorMessage={errors.generationStyle?.message}
          description="How detailed should be the persona?"
          className="w-full"
        >
          <SelectItem key="detailed_realistic">
            Provide lot of details and make it realistic
          </SelectItem>
          <SelectItem key="strict">
            Strict information about the persona
          </SelectItem>
          <SelectItem key="roleplay">
            Perfect to define a roleplay character
          </SelectItem>
        </Select>
      </div> */}

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Common</h3>
      </div>

      <div>
        <Input
          label="Persona Name"
          placeholder="Alice Cooper"
          errorMessage={errors.personaName?.message}
          // {...register("personaName")}
          required={false}
          isRequired={false}
        />
      </div>

      <div>
        <Select
          label="Gender"
          {...register("gender")}
          errorMessage={errors.gender?.message}
        >
          {["male", "female", "other"].map((gender) => (
            <SelectItem key={gender}>{gender}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Age</h3>
      </div>

      <div className="col-span-full">
        <Tabs aria-label="Age">
          <Tab
            key="predefined"
            title="Predefined"
            className="flex flex-wrap gap-2"
          >
            {predefinedAges.map((age) => (
              <Chip
                variant={getValues("age") === age.value ? "solid" : "flat"}
                key={age.value}
                className="cursor-pointer"
                onClick={() =>
                  setValue("age", age.value, {
                    shouldValidate: true,
                  })
                }
              >
                {age.label}
              </Chip>
            ))}
          </Tab>
          <Tab key="custom" title="Custom">
            <Input
              type="number"
              label="Age"
              className="max-w-md"
              description="Enter persona age"
              {...register("age")}
            />
          </Tab>
        </Tabs>
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Occupation</h3>
      </div>

      <div className="col-span-full">
        <Tabs aria-label="Occupation">
          <Tab
            key="predefined"
            title="Predefined"
            className="flex flex-wrap gap-2"
          >
            {predefinedOccupations.map((occupation) => (
              <Chip
                className="cursor-pointer"
                variant={
                  getValues("occupation") === occupation ? "solid" : "flat"
                }
                key={occupation}
                onClick={() =>
                  setValue("occupation", occupation, {
                    shouldValidate: true,
                  })
                }
              >
                {occupation}
              </Chip>
            ))}
          </Tab>
          <Tab key="custom" title="Custom">
            <Input
              errorMessage={errors.occupation?.message}
              label="Custom Occupation"
              placeholder="Artist, Engineer"
              description="You can write multiple occupations"
              {...register("occupation")}
            />
          </Tab>
        </Tabs>
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">
          Personality Traits
        </h3>
      </div>

      <div className="flex flex-wrap gap-1">
        {predefinedPersonalityTraits.map((personalityTrait) => (
          <Chip
            className="cursor-pointer"
            variant={
              getValues("personalityTraits")?.includes(personalityTrait)
                ? "solid"
                : "flat"
            }
            key={personalityTrait}
            onClick={() =>
              setValue(
                "personalityTraits",
                getValues("personalityTraits")?.includes(personalityTrait)
                  ? getValues("personalityTraits")?.filter(
                      (trait) => trait !== personalityTrait
                    )
                  : [
                      ...(getValues("personalityTraits") || []),
                      personalityTrait,
                    ],
                {
                  shouldValidate: true,
                }
              )
            }
          >
            {personalityTrait}
          </Chip>
        ))}
      </div>

      <div>
        <Textarea
          errorMessage={errors.occupation?.message}
          label="Custom Personality Traits"
          placeholder="Dreaming of a perfect world"
          description="Will be added to the selected predefined traits"
          {...register("personalityTraitsCustom")}
        />
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Background</h3>
      </div>

      <div className="col-span-full">
        <Tabs aria-label="Background">
          <Tab
            key="predefined"
            title="Predefined"
            className="flex flex-wrap gap-1"
          >
            {predefinedBackgrounds.map((background) => (
              <Chip
                className="cursor-pointer"
                variant={
                  getValues("background") === background ? "solid" : "flat"
                }
                key={background}
                onClick={() =>
                  setValue("background", background, {
                    shouldValidate: true,
                  })
                }
              >
                {background}
              </Chip>
            ))}
          </Tab>
          <Tab key="custom" title="Custom">
            <Input
              errorMessage={errors.background?.message}
              label="Custom Background"
              placeholder="A quiet suburban neighborhood"
              description="Write about persona background"
              {...register("background")}
            />
          </Tab>
        </Tabs>
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Education</h3>
      </div>

      <div className="col-span-full">
        <Tabs aria-label="Education">
          <Tab
            key="predefined"
            title="Predefined"
            className="flex flex-wrap gap-1"
          >
            {predefinedEducationLevels.map((educationLevel) => (
              <Chip
                className="cursor-pointer"
                variant={
                  getValues("educationLevel") === educationLevel
                    ? "solid"
                    : "flat"
                }
                key={educationLevel}
                onClick={() =>
                  setValue("educationLevel", educationLevel, {
                    shouldValidate: true,
                  })
                }
              >
                {educationLevel}
              </Chip>
            ))}
          </Tab>
          <Tab key="custom" title="Custom">
            <Input
              errorMessage={errors.educationLevel?.message}
              label="Custom Education Level"
              placeholder="Bachelor, Master"
              description="Write about persona education level"
              {...register("educationLevel")}
            />
          </Tab>
        </Tabs>
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Hobbies</h3>
      </div>

      <div className="">
        {predefinedHobbies.map((hobby) => (
          <Chip
            className="cursor-pointer mr-1 mb-1"
            variant={getValues("hobbies")?.includes(hobby) ? "solid" : "flat"}
            key={hobby}
            onClick={() =>
              setValue(
                "hobbies",
                getValues("hobbies")?.includes(hobby)
                  ? getValues("hobbies")?.filter((h) => h !== hobby)
                  : [...(getValues("hobbies") || []), hobby],
                {
                  shouldValidate: true,
                }
              )
            }
          >
            {hobby}
          </Chip>
        ))}
      </div>

      <div>
        <Textarea
          errorMessage={errors.hobbies?.message}
          label="Custom Hobbies"
          placeholder="Reading, Traveling"
          description="Will be added to the selected predefined hobbies"
          {...register("hobbiesCustom")}
        />
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">
          Cultural Background
        </h3>
      </div>

      <div className="col-span-full">
        <Tabs aria-label="Cultural Background">
          <Tab
            key="predefined"
            title="Predefined"
            className="flex flex-wrap gap-1"
          >
            {predefinedCulturalBackgrounds.map((culturalBackground) => (
              <Chip
                className="cursor-pointer"
                variant={
                  getValues("culturalBackground") === culturalBackground
                    ? "solid"
                    : "flat"
                }
                key={culturalBackground}
                onClick={() =>
                  setValue("culturalBackground", culturalBackground, {
                    shouldValidate: true,
                  })
                }
              >
                {culturalBackground}
              </Chip>
            ))}
          </Tab>
          <Tab key="custom" title="Custom">
            <Input
              errorMessage={errors.culturalBackground?.message}
              label="Custom Cultural Background"
              placeholder="Western, African"
              description="Write about persona cultural background"
              {...register("culturalBackground")}
            />
          </Tab>
        </Tabs>
      </div>

      <div className="col-span-full flex items-center gap-1">
        <h3 className="text-large text-foreground-500 p-3">Relationship</h3>
        {getValues("relationship") && (
          <Button
            isIconOnly
            className="text-foreground-500 hover:text-foreground-600"
            size="sm"
            variant="light"
            onPress={() =>
              setValue("relationship", "", {
                shouldValidate: true,
              })
            }
          >
            <Eraser size={12} />
          </Button>
        )}
      </div>

      <div className="col-span-full">
        {predefinedRelationships.map((relationship) => (
          <Chip
            className="cursor-pointer mr-1 mb-1"
            variant={
              getValues("relationship") === relationship ? "solid" : "flat"
            }
            key={relationship}
            onClick={() =>
              setValue("relationship", relationship, {
                shouldValidate: true,
              })
            }
          >
            {relationship}
          </Chip>
        ))}
      </div>

      <div className="col-span-full">
        <Button
          type="submit"
          className="w-full"
          variant="shadow"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          Create
        </Button>
      </div>

      <div className="col-span-full">
        <p className="text-small text-foreground-500 text-center text-balance">
          Creator is in beta. We're working on adding more options and making
          the experience better. If you have any suggestions or feedback, join
          our discord and share it:{" "}
          <Link color="secondary" href="https://discord.gg/By5AnDQDTQ">
            Join
          </Link>
        </p>
      </div>
    </form>
  );
}
