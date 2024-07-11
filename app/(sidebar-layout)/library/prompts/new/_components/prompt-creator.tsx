"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import PromptTextPromptForm from "./prompt-text-prompt-form";
import PromptCreatorForm from "./prompt-creator-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@nextui-org/skeleton";

export default function PromptCreator() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
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
    <Tabs
      onSelectionChange={(key) => {
        const sp = new URLSearchParams(searchParams);
        sp.set("mode", key as string);
        replace(`?${sp.toString()}`);
      }}
      aria-label="Persona Form"
      variant="underlined"
      selectedKey={
        searchParams.get("mode") === "text-prompt" ? "text-prompt" : "creator"
      }
    >
      <Tab key="creator" title="Creator">
        <PromptCreatorForm />
      </Tab>
      <Tab key="text-prompt" title="Text Prompt">
        <PromptTextPromptForm />
      </Tab>
    </Tabs>
  );
}
