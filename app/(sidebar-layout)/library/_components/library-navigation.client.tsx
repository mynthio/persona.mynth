"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import { usePathname } from "next/navigation";

export default function LibraryNavigation() {
  const pathname = usePathname();

  return (
    <Tabs selectedKey={pathname} aria-label="Tabs">
      <Tab key="/library" href="/library" title="Library" />
      <Tab key="/library/personas" href="/library/personas" title="Personas" />
      <Tab key="/library/prompts" href="/library/prompts" title="Prompts" />
      <Tab
        key="/library/prompts/new"
        href="/library/prompts/new"
        title="New prompt"
      />
    </Tabs>
  );
}
