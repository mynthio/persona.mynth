"use client";

import { Button } from "@nextui-org/button";

type Props = {
  personaId: string;
};

export default function LocalChatButton({ personaId }: Props) {
  const localChat = JSON.parse(
    localStorage.getItem(`chat:${personaId}`) || "[]"
  );

  if (localChat.length < 1) return null;

  return <Button variant="light">Open local chat</Button>;
}
