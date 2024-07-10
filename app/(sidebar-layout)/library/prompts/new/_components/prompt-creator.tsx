"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import PromptTextPromptForm from "./prompt-text-prompt-form";
import PromptCreatorForm from "./prompt-creator-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function PromptCreator() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

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
