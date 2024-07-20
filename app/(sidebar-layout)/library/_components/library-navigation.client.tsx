"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LibraryNavigation() {
  const pathname = usePathname();

  return (
    <Tabs selectedKey={pathname} aria-label="Tabs">
      <Tab key="/library/personas" href="/library/personas" title="Personas" />
      <Tab key="/library/prompts" href="/library/prompts" title="Prompts" />
      <Tab key="/library/chats" href="/library/chats" title="Chats" />
      <Tab
        key="/library/prompts/new"
        href="/library/prompts/new"
        title={<Plus size={12} />}
      />
    </Tabs>
  );
}
