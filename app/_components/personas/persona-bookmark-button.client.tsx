"use client";

import { bookmarkPersonaAction } from "@/app/_actions/bookmark-persona.action";
import { likePersonaAction } from "@/app/_actions/like-persona.action";
import { unBookmarkPersonaAction } from "@/app/_actions/un-bookmark-persona.action copy";
import { unLikePersonaAction } from "@/app/_actions/unlike-persona.action";
import { GetPersonasReturn } from "@/app/_services/personas.service";
import { Button } from "@nextui-org/button";
import { Bookmark, Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
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
  const { mutate } = useSWRConfig();

  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page"));

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
