"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { createPromptAction } from "@/app/_actions/create-prompt.action";
import {
  CreatorPrompt,
  CreatorPromptSchema,
} from "@/schemas/create-prompt.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { Link, Slider, Switch, useDisclosure } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

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

function ProfessionsSection() {
  const { register, control } = useFormContext(); // retrieve all hook methods

  const { onOpen } = useDisclosure();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "professions",
  });

  return (
    <>
      <Button
        fullWidth
        variant="flat"
        endContent={<Plus size={12} />}
        onPress={() => {
          append({
            profession: "",
          });

          onOpen();
        }}
      >
        Add Profession
      </Button>

      <div className="mt-2 space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-1">
              <Button variant="light" isIconOnly onPress={() => remove(index)}>
                <Trash size={12} />
              </Button>
              <Autocomplete
                allowsCustomValue
                label="Profession"
                placeholder="Artist, Engineer"
                {...register(`professions.${index}.profession`)}
              >
                {predefinedOccupations.map((profession) => (
                  <AutocompleteItem key={profession} value={profession}>
                    {profession}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Experience"
                placeholder="5-10 years"
                {...register(`professions.${index}.experience`)}
              />

              <Switch
                {...register(`professions.${index}.isActive`, {
                  value: true,
                })}
              >
                Is actively working
              </Switch>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const MIN_VALUE = 0;
const MAX_VALUE = 10;
const DEFAULT_VALUE = 5;
const STEP = 1;

const personalityTraits = [
  {
    name: "emotionalStability",
    label: "Emotional Stability",
    marks: [
      { value: 2, label: "Very Calm" },
      { value: 5, label: "Balanced" },
      { value: 8, label: "Very Excitable" },
    ],
  },
  {
    name: "socialInteractionStyle",
    label: "Social Interaction Style",
    marks: [
      { value: 2, label: "Highly Introverted" },
      { value: 5, label: "Ambivert" },
      { value: 8, label: "Highly Extroverted" },
    ],
  },
  {
    name: "problemSolvingApproach",
    label: "Problem-Solving Approach",
    marks: [
      { value: 2, label: "Extremely Analytical" },
      { value: 5, label: "Balanced Thinker" },
      { value: 8, label: "Highly Creative" },
    ],
  },
  {
    name: "seriousnessLevel",
    label: "Seriousness Level",
    marks: [
      { value: 2, label: "Very Serious" },
      { value: 5, label: "Moderate" },
      { value: 8, label: "Very Playful" },
    ],
  },
  {
    name: "riskAttitude",
    label: "Risk Attitude",
    marks: [
      { value: 2, label: "Overly Cautious" },
      { value: 5, label: "Balanced Risk Taker" },
      { value: 8, label: "Extremely Adventurous" },
    ],
  },
  {
    name: "empathyVsPragmatism",
    label: "Empathy vs Pragmatism",
    marks: [
      { value: 2, label: "Highly Empathetic" },
      { value: 5, label: "Balanced" },
      { value: 8, label: "Strictly Pragmatic" },
    ],
  },
  {
    name: "assertiveness",
    label: "Assertiveness",
    marks: [
      { value: 2, label: "Very Passive" },
      { value: 5, label: "Assertive" },
      { value: 8, label: "Highly Aggressive" },
    ],
  },
  {
    name: "opennessToExperience",
    label: "Openness to Experience",
    marks: [
      { value: 2, label: "Very Traditional" },
      { value: 5, label: "Moderately Open" },
      { value: 8, label: "Extremely Open to New Ideas" },
    ],
  },
  {
    name: "conscientiousness",
    label: "Conscientiousness",
    marks: [
      { value: 2, label: "Very Spontaneous" },
      { value: 5, label: "Balanced" },
      { value: 8, label: "Highly Organized" },
    ],
  },
  {
    name: "confidenceLevel",
    label: "Confidence Level",
    marks: [
      { value: 2, label: "Very Insecure" },
      { value: 5, label: "Balanced Confidence" },
      { value: 8, label: "Overly Confident" },
    ],
  },
];

function PersonalitySection() {
  const { register, control } = useFormContext(); // retrieve all hook methods

  return (
    <>
      <div className="space-y-20 mt-4">
        {personalityTraits.map((trait) => (
          <Controller
            key={trait.name}
            name={`personality.${trait.name}`}
            control={control}
            defaultValue={undefined}
            render={(props) => (
              <Slider
                {...props}
                onChange={(value) =>
                  props.field.onChange(Array.isArray(value) ? value[0] : value)
                }
                label={trait.label}
                color="foreground"
                minValue={MIN_VALUE}
                maxValue={MAX_VALUE}
                step={STEP}
                defaultValue={undefined}
                marks={trait.marks}
              />
            )}
          />
        ))}
      </div>
    </>
  );
}

export default function PromptCreatorForm() {
  const { push } = useRouter();

  const formMethods = useForm<CreatorPrompt>({
    resolver: superstructResolver(CreatorPromptSchema),
    defaultValues: {
      gender: "random",
    },
  });

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      {JSON.stringify(getValues())}
      <form
        className="w-full"
        onSubmit={handleSubmit(async (data) => {
          console.log(data);
          return;

          if (isSubmitting) return;
          const { personaPromptId } = await createPromptAction(data);
          push(`/library/prompts/${personaPromptId}`);
        })}
      >
        {JSON.stringify(errors)}
        <Accordion fullWidth className="mt-20">
          <AccordionItem
            key="settings"
            aria-label="Settings"
            title="Settings"
            subtitle="Persona style"
          >
            <div>
              <Select
                label="Persona style"
                errorMessage={errors.style?.message}
                description="What kind of persona would you like to generate?"
                {...register("style")}
              >
                <SelectItem key="realistic">Realistic</SelectItem>
                <SelectItem key="fantasy">Fantasy</SelectItem>
                <SelectItem key="anime">Anime</SelectItem>
              </Select>
            </div>
          </AccordionItem>

          <AccordionItem
            key="common"
            aria-label="Common"
            title="Common"
            subtitle="Persona name, gender, age..."
            classNames={{
              content: "grid lg:grid-cols-2 gap-2 gap-y-6",
            }}
          >
            <Input
              label="Persona Name"
              placeholder="Alice Cooper"
              errorMessage={errors.personaName?.message}
              {...register("personaName")}
            />

            <Select
              label="Gender"
              {...register("gender")}
              errorMessage={errors.gender?.message}
            >
              {["male", "female", "other"].map((gender) => (
                <SelectItem key={gender}>{gender}</SelectItem>
              ))}
            </Select>

            <div className="col-span-full">
              <Tabs aria-label="Age" variant="underlined">
                <Tab
                  key="predefined"
                  title="Predefined Age"
                  className="flex flex-wrap gap-2"
                >
                  {predefinedAges.map((age) => (
                    <Chip
                      variant={
                        getValues("age") === age.value ? "solid" : "flat"
                      }
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
                <Tab key="custom" title="Custom Age">
                  <Input
                    type="string"
                    label="Age"
                    className="max-w-md"
                    description="Enter persona age. You can write ranges like 18-24."
                    {...register("age")}
                  />
                </Tab>
              </Tabs>
            </div>
          </AccordionItem>

          <AccordionItem
            key="personality"
            title="Personality"
            subtitle="Personality traits"
          >
            <PersonalitySection />
          </AccordionItem>

          <AccordionItem
            key="profession"
            title="Profession"
            subtitle="Work, occupation, work experience"
          >
            <ProfessionsSection />
          </AccordionItem>
        </Accordion>

        <div className="col-span-full mt-20">
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
            <Link color="secondary" href="https://discord.gg/5GNHhYq2sX">
              Join
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
