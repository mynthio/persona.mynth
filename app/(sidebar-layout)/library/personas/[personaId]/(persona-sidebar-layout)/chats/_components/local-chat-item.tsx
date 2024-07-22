"use client";

import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Clock } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

type Props = {
  personaId: string;
};

export default function LocalChatItem({ personaId }: Props) {
  const localChat = JSON.parse(
    localStorage.getItem(`chat:${personaId}`) || "null"
  );
  if (!localChat) return null;

  return (
    <section>
      <Chip variant="light">local</Chip>
      <Chip startContent={<Clock size={12} />} variant="light">
        {dayjs(localChat.createdAt).fromNow()}
      </Chip>
      <h2 className="text-4xl font-thin text-foreground-500">
        <Link href={`/library/personas/${personaId}/chats/local`}>
          {localChat.name || "New local chat"}
        </Link>
      </h2>
    </section>
  );
}
