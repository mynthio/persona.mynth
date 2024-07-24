import React from "react";
import { PersonaContext } from "./persona-context";
import { likePersonaAction } from "@/app/_actions/like-persona.action";
import { unLikePersonaAction } from "@/app/_actions/unlike-persona.action";

type Args = {
  personaId: string;
  likes: number;
  liked: boolean;
};

export const usePersonaLikeButton = (args: Args) => {
  const [personaLike, setPersonaLike] = React.useOptimistic(
    {
      likes: args.likes,
      liked: args.liked,
    },
    (currentState, optimisticValue) => {
      return {
        likes: optimisticValue.likes,
        liked: optimisticValue.liked,
      };
    },
  );

  return {
    liked: personaLike.liked,
    likes: personaLike.likes,
    onPress: async () => {
      const action = personaLike.liked
        ? unLikePersonaAction
        : likePersonaAction;
      await action(args.personaId);

      setPersonaLike({
        likes: personaLike.liked
          ? personaLike.likes - 1
          : personaLike.likes + 1,
        liked: !personaLike.liked,
      });
    },
  };
};
