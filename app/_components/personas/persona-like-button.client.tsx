"use client";

import { likePersonaAction } from "@/app/_actions/like-persona.action";
import { unLikePersonaAction } from "@/app/_actions/unlike-persona.action";
import { Button } from "@nextui-org/button";
import { Heart } from "lucide-react";
import { PersonaContext } from "./personas.client";
import React from "react";

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
  const { mutatePersona } = React.useContext(PersonaContext) || {};

  // TODO: Use optimistic mutations
  return (
    <Button
      onPress={async () => {
        if (isLiked) {
          await unLikePersonaAction(personaId);

          mutatePersona?.({
            id: personaId,
            isLiked: false,
            likes: [],
            likesCount: likesCount - 1,
          });
        } else {
          await likePersonaAction(personaId);

          mutatePersona?.({
            id: personaId,
            isLiked: true,
            likes: [{} as any],
            likesCount: likesCount + 1,
          });
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
