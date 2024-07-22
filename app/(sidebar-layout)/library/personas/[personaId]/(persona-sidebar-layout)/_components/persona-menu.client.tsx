"use client";

import { Listbox, ListboxItem } from "@nextui-org/listbox";
import {
  BookUser,
  Globe,
  Images,
  MessageSquare,
  MessagesSquare,
} from "lucide-react";

type Props = {
  personaId: string;
};

export default function PersonaMenu(props: Props) {
  return (
    <div className="rounded-xl w-full border-2 border-foreground-200">
      <Listbox>
        <ListboxItem
          startContent={<BookUser size={12} />}
          key="publish"
          href={`/library/personas/${props.personaId}`}
        >
          Persona
        </ListboxItem>
        <ListboxItem
          startContent={<MessagesSquare size={12} />}
          key="chat"
          href={`/library/personas/${props.personaId}/chats`}
        >
          Chats
        </ListboxItem>
        <ListboxItem startContent={<Images size={12} />} key="gallery">
          Gallery
        </ListboxItem>
        <ListboxItem startContent={<Globe size={12} />} key="publish">
          Publish
        </ListboxItem>
      </Listbox>
    </div>
  );
}
