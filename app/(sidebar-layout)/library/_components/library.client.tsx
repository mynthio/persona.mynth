"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import dynamic from "next/dynamic";
const Personas = dynamic(() => import("./personas.client"), {
  ssr: false,
});

export default function Library() {
  return (
    <Tabs>
      <Tab key="personas" title="Personas">
        <Personas />
      </Tab>
      <Tab key="prompts" title="Prompts">
        Prompts
      </Tab>
      <Tab key="chats" title="Chats">
        Chats
      </Tab>
    </Tabs>
  );
}
