"use client";

import { useAuth } from "@clerk/nextjs";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Skeleton } from "@nextui-org/skeleton";
import { Tab, Tabs } from "@nextui-org/tabs";

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
  { value: "doctor", label: "Doctor" },
  { value: "teacher", label: "Teacher" },
  { value: "engineer", label: "Engineer" },
  { value: "lawyer", label: "Lawyer" },
  { value: "artist", label: "Artist" },
  { value: "writer", label: "Writer" },
  { value: "programmer", label: "Programmer" },
  { value: "chef", label: "Chef" },
  { value: "manager", label: "Manager" },
  { value: "nurse", label: "Nurse" },
  { value: "accountant", label: "Accountant" },
  { value: "analyst", label: "Analyst" },
  { value: "designer", label: "Designer" },
  { value: "developer", label: "Developer" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "investor", label: "Investor" },
  { value: "journalist", label: "Journalist" },
  { value: "politician", label: "Politician" },
  { value: "scientist", label: "Scientist" },
  { value: "soldier", label: "Soldier" },
  { value: "teacher", label: "Teacher" },
  { value: "psychologist", label: "Psychologist" },
  { value: "lawyer", label: "Lawyer" },
  { value: "engineer", label: "Engineer" },
  { value: "doctor", label: "Doctor" },
  { value: "artist", label: "Artist" },
];

export default function PromptCreatorForm() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded)
    return (
      <div className="space-y-4">
        <Skeleton className="rounded-lg">
          <div className="h-10 rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-10 rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    );

  if (!isSignedIn)
    return <div>You need to be logged in to generate a persona</div>;

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Settings</h3>
      </div>

      <div>
        <Select
          required
          isRequired
          label="Persona style"
          defaultSelectedKeys={["realistic"]}
          description="What kind of persona would you like to generate?"
        >
          <SelectItem key="realistic">Realistic</SelectItem>
          <SelectItem key="fantasy">Fantasy</SelectItem>
        </Select>
      </div>

      <div>
        <Select
          required
          isRequired
          label="Generation Style"
          defaultSelectedKeys={["detailed_realistic"]}
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
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Common</h3>
      </div>

      <div>
        <Input label="Persona Name" placeholder="Alice Cooper" />
      </div>

      <div>
        <Select label="Gender">
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
              <Chip variant="flat" key={age.value}>
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
            />
          </Tab>
        </Tabs>
      </div>

      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Occupation(s)</h3>
      </div>

      <div className="col-span-full grid grid-cols-2 gap-4">
        <div className="flex flex-wrap gap-2">
          {predefinedOccupations.map((occupation) => (
            <Chip variant="flat" key={occupation.value}>
              {occupation.label}
            </Chip>
          ))}
        </div>

        <div>
          <Input
            label="Custom Occupation"
            placeholder="Artist"
            description="Add custom one"
          />
        </div>
      </div>
    </form>
  );
}
