"use client";

import { likePersonaAction } from "@/app/_actions/like-persona.action";
import { unLikePersonaAction } from "@/app/_actions/unlike-persona.action";
import { GetPersonasReturn } from "@/app/_services/personas.service";
import { Button } from "@nextui-org/button";
import { Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";

type Props = {
  personaId: string;
  likesCount: number;
  isLiked: boolean;
};

export default function PersonaLikeButton({
  personaId,
  likesCount,
  isLiked,
}: Props) {
  const { mutate } = useSWRConfig();

  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page"));

  // TODO: Use optimistic mutations
  return (
    <Button
      onPress={async () => {
        if (isLiked) {
          await unLikePersonaAction(personaId);

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
                          likesCount: persona.likesCount - 1,
                          likes: [],
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
          await likePersonaAction(personaId);

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
                          likesCount: persona.likesCount + 1,
                          likes: [{} as any],
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
      color="danger"
      variant="light"
      endContent={
        <Heart
          size={16}
          className="ml-2"
          fill={isLiked ? "currentColor" : "transparent"}
        />
      }
    >
      {likesCount}
    </Button>
  );
}
