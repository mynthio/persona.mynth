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

  return (
    <Button
      onPress={async () => {
        if (isBookmarked) {
          await unBookmarkPersonaAction(personaId);

          mutate<{ personas: GetPersonasReturn }>(
            `/api/personas?page=${page > 0 ? page : 1}&nswf=false`,
            (data) =>
              data
                ? {
                    ...data,
                    personas: data.personas.map((persona) => {
                      if (persona.id === personaId) {
                        return {
                          ...persona,
                          bookmarks: [],
                        };
                      }

                      return persona;
                    }),
                  }
                : { personas: [] },
            {
              revalidate: false,
            }
          );
        } else {
          await bookmarkPersonaAction(personaId);

          mutate<{ personas: GetPersonasReturn }>(
            `/api/personas?page=${page > 0 ? page : 1}&nswf=false`,
            (data) =>
              data
                ? {
                    ...data,
                    personas: data.personas.map((persona) => {
                      if (persona.id === personaId) {
                        return {
                          ...persona,
                          bookmarks: [{} as any],
                        };
                      }

                      return persona;
                    }),
                  }
                : { personas: [] },
            {
              revalidate: false,
            }
          );
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
