"use client";

import { bookmarkPersonaAction } from "@/app/_actions/bookmark-persona.action";
import { unBookmarkPersonaAction } from "@/app/_actions/un-bookmark-persona.action copy";
import { Button } from "@nextui-org/button";
import { Bookmark } from "lucide-react";
import { PersonaContext } from "./personas.client";
import React from "react";

type Props = {
  personaId: string;
  isBookmarked: boolean;
};

export default function PersonaBookmarkButton({
  personaId,
  isBookmarked,
}: Props) {
  const { mutatePersona } = React.useContext(PersonaContext) || {};

  return (
    <Button
      onPress={async () => {
        if (isBookmarked) {
          await unBookmarkPersonaAction(personaId);

          mutatePersona?.({
            id: personaId,
            isBookmarked: false,
            bookmarks: [],
          });
        } else {
          await bookmarkPersonaAction(personaId);

          mutatePersona?.({
            id: personaId,
            isBookmarked: true,
            bookmarks: [{} as any],
          });
        }
      }}
      color="default"
      variant="light"
      endContent={
        <Bookmark
          size={16}
          fill={isBookmarked ? "currentColor" : "transparent"}
        />
      }
      isIconOnly
    />
  );
}
