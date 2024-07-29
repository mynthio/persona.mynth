"use client";

import { createPromptAction } from "@/app/_actions/create-prompt.action";
import {
  CreatorPrompt,
  CreatorPromptSchema,
} from "@/schemas/create-prompt.schema";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input, Textarea } from "@nextui-org/input";
import { Link } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
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
  "writing",
];

const predefinedRelationships = [
  "single",
  "in a relationship",
  "married",
  "divorced",
  "widowed",
];

function ProfessionsSection() {
  const { register, control } = useFormContext<CreatorPrompt>(); // retrieve all hook methods

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "occupations",
  });

  return (
    <>
      <div className="flex flex-wrap gap-1 items-center">
        {predefinedOccupations.map((occupation) =>
          fields.find((field) => field.occupation === occupation) ? (
            <Chip
              variant="solid"
              color="secondary"
              onClose={() =>
                remove(
                  fields.findIndex((field) => field.occupation === occupation)
                )
              }
              key={occupation}
            >
              {occupation}
            </Chip>
          ) : (
            <Chip
              onClick={() => append({ occupation })}
              key={occupation}
              className="cursor-pointer"
            >
              {occupation}
            </Chip>
          )
        )}
      </div>
      <Textarea
        size="sm"
        className="mt-2"
        minRows={1}
        placeholder="Provide additional occupations"
        {...register("occupationCustom")}
      />
    </>
  );
}

function PersonalitySection() {
  const { control, register } = useFormContext<CreatorPrompt>();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "personalityTraits",
  });

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {predefinedPersonalityTraits.map((trait) =>
          fields.find((field) => field.trait === trait) ? (
            <Chip
              variant="solid"
              color="secondary"
              onClose={() =>
                remove(fields.findIndex((field) => field.trait === trait))
              }
              key={trait}
            >
              {trait}
            </Chip>
          ) : (
            <Chip
              onClick={() => append({ trait })}
              key={trait}
              className="cursor-pointer"
            >
              {trait}
            </Chip>
          )
        )}
      </div>

      <Textarea
        size="sm"
        className="mt-2"
        minRows={1}
        placeholder="Provide additional personality traits"
        {...register("personalityTraitsCustom")}
      />
    </>
  );
}

function AppearanceSection() {
  const { register, control, setValue } = useFormContext<CreatorPrompt>();

  return (
    <div className="mt-2 space-y-10">
      <Controller
        name="apperance.hairLength"
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-wrap gap-1">
            <Chip variant="light">Hair length:</Chip>
            {["bald", "short", "medium", "long", "very long"].map(
              (hairLength) => (
                <Chip
                  variant={value === hairLength ? "solid" : "flat"}
                  color={value === hairLength ? "secondary" : "default"}
                  key={hairLength}
                  className="cursor-pointer"
                  onClick={() => onChange(hairLength)}
                >
                  {hairLength}
                </Chip>
              )
            )}
          </div>
        )}
      />

      <Controller
        name="apperance.hairColor"
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-wrap gap-1">
            <Chip variant="light">Hair color:</Chip>
            {[
              "black",
              "brown",
              "blonde",
              "red",
              "gray",
              "white",
              "auburn",
              "chestnut",
              "platinum",
            ].map((skinColor) => (
              <Chip
                variant={value === skinColor ? "solid" : "flat"}
                color={value === skinColor ? "secondary" : "default"}
                key={skinColor}
                className="cursor-pointer"
                onClick={() => onChange(skinColor)}
              >
                {skinColor}
              </Chip>
            ))}
          </div>
        )}
      />

      <Controller
        name="apperance.eyeColor"
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-wrap gap-1">
            <Chip variant="light">Eye color:</Chip>
            {["brown", "blue", "green", "hazel", "gray", "amber", "black"].map(
              (eyeColor) => (
                <Chip
                  variant={value === eyeColor ? "solid" : "flat"}
                  color={value === eyeColor ? "secondary" : "default"}
                  key={eyeColor}
                  className="cursor-pointer"
                  onClick={() => onChange(eyeColor)}
                >
                  {eyeColor}
                </Chip>
              )
            )}
          </div>
        )}
      />

      {/* const skinColorOptions: string[] = ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Brown', 'Dark']; */}
      <Controller
        name="apperance.skinColor"
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-wrap gap-1">
            <Chip variant="light">Skin color:</Chip>
            {[
              "fair",
              "light",
              "medium",
              "olive",
              "tan",
              "brown",
              "dark",
              "black",
              "white",
            ].map((skinColor) => (
              <Chip
                variant={value === skinColor ? "solid" : "flat"}
                color={value === skinColor ? "secondary" : "default"}
                key={skinColor}
                className="cursor-pointer"
                onClick={() => onChange(skinColor)}
              >
                {skinColor}
              </Chip>
            ))}
          </div>
        )}
      />

      {/* const bodyTypeOptions: string[] = ['Slim', 'Average', 'Athletic', 'Curvy', 'Muscular', 'Petite', 'Plus-size']; */}
      <Controller
        name="apperance.bodyType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-wrap gap-1">
            <Chip variant="light">Body type:</Chip>
            {[
              "slim",
              "average",
              "athletic",
              "curvy",
              "muscular",
              "petite",
              "plus-size",
            ].map((bodyType) => (
              <Chip
                variant={value === bodyType ? "solid" : "flat"}
                color={value === bodyType ? "secondary" : "default"}
                key={bodyType}
                className="cursor-pointer"
                onClick={() => onChange(bodyType)}
              >
                {bodyType}
              </Chip>
            ))}
          </div>
        )}
      />

      <Textarea
        size="sm"
        className="mt-2"
        minRows={1}
        placeholder="Provide additional appearance details"
        {...register("apperance.custom")}
      />
    </div>
  );
}

function HobbiesSection() {
  const { register, control } = useFormContext<CreatorPrompt>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {predefinedHobbies.map((hobby: string) =>
          fields.find((field) => field.hobby === hobby) ? (
            <Chip
              variant="solid"
              color="secondary"
              onClose={() =>
                remove(fields.findIndex((field) => field.hobby === hobby))
              }
              key={hobby}
            >
              {hobby}
            </Chip>
          ) : (
            <Chip
              onClick={() => append({ hobby })}
              key={hobby}
              className="cursor-pointer"
            >
              {hobby}
            </Chip>
          )
        )}
      </div>

      <Textarea
        size="sm"
        className="mt-2"
        minRows={1}
        placeholder="Provide additional hobbies"
        {...register("hobbiesCustom")}
      />
    </>
  );
}

function RelationshipSection() {
  const { register, control } = useFormContext<CreatorPrompt>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "relationship",
  });

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {predefinedRelationships.map((relationship: string) =>
          fields.find((field) => field.relationship === relationship) ? (
            <Chip
              variant="solid"
              color="secondary"
              onClose={() =>
                remove(
                  fields.findIndex(
                    (field) => field.relationship === relationship
                  )
                )
              }
              key={relationship}
            >
              {relationship}
            </Chip>
          ) : (
            <Chip
              onClick={() => append({ relationship })}
              key={relationship}
              className="cursor-pointer"
            >
              {relationship}
            </Chip>
          )
        )}
      </div>

      <Textarea
        size="sm"
        className="mt-2"
        minRows={1}
        placeholder="Provide additional relationship"
        {...register("relationshipCustom")}
      />
    </>
  );
}

export default function PromptCreatorForm() {
  const { push } = useRouter();

  const formMethods = useForm<CreatorPrompt>({
    resolver: superstructResolver(CreatorPromptSchema),
    defaultValues: {
      style: "realistic",
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
      <form
        className="w-full"
        onSubmit={handleSubmit(async (data) => {
          if (isSubmitting) return;
          const { personaPromptId } = await createPromptAction(data);
          push(`/library/prompts/${personaPromptId}`);
        })}
      >
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
                {/* <SelectItem key="fantasy">Fantasy</SelectItem>
                <SelectItem key="anime">Anime</SelectItem> */}
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
            subtitle="Work, occupation"
          >
            <ProfessionsSection />
          </AccordionItem>

          <AccordionItem
            key="appearance"
            title="Appearance"
            subtitle="Personal appearance"
          >
            <AppearanceSection />
          </AccordionItem>

          <AccordionItem
            key="hobbies"
            title="Hobbies"
            subtitle="Hobbies & Interests"
          >
            <HobbiesSection />
          </AccordionItem>

          <AccordionItem
            key="relationship"
            title="Relationship"
            subtitle="Relationship with others"
          >
            <RelationshipSection />
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

        <div className="col-span-full mt-2">
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
    </FormProvider>
  );
}
