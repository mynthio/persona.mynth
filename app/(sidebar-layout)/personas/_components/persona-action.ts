import React from "react";
import { PersonaContext } from "./persona-context";
import { likePersonaAction } from "@/app/_actions/like-persona.action";
import { unLikePersonaAction } from "@/app/_actions/unlike-persona.action";
import { unBookmarkPersonaAction } from "@/app/_actions/un-bookmark-persona.action copy";
import { bookmarkPersonaAction } from "@/app/_actions/bookmark-persona.action";

type Args = {
  personaId: string;
  likes: number;
  liked: boolean;
};

export const usePersonaLikeAction = (args: Args) => {
  const [likes, setLikes] = React.useState<number>(args.likes);
  const [liked, setliked] = React.useState<boolean>(args.liked);
  const [loading, setLoading] = React.useState<boolean>(false);

  return {
    likes,
    liked,
    loading,
    onPress: async () => {
      setLoading(true);

      const action = liked ? unLikePersonaAction : likePersonaAction;
      await action(args.personaId).finally(() => {
        setLoading(false);
      });

      setLikes(liked ? likes - 1 : likes + 1);
      setliked(!liked);
    },
  };
};

type UsePersonaBookmarkActionArgs = {
  personaId: string;
  bookmarked: boolean;
};

export const usePersonaBookmarkAction = (
  args: UsePersonaBookmarkActionArgs
) => {
  const [bookmarked, setBookmarked] = React.useState<boolean>(args.bookmarked);
  const [loading, setLoading] = React.useState<boolean>(false);

  return {
    bookmarked,
    loading,
    onPress: async () => {
      setLoading(true);

      const action = bookmarked
        ? unBookmarkPersonaAction
        : bookmarkPersonaAction;

      await action(args.personaId).finally(() => {
        setLoading(false);
      });

      setBookmarked(!bookmarked);
    },
  };
};
