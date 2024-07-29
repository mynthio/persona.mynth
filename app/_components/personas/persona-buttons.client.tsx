"use client";

import { Button } from "@nextui-org/button";
import { PropsOf } from "@nextui-org/system";
import { Bookmark, Heart } from "lucide-react";
import {
  usePersonaBookmarkAction,
  usePersonaLikeAction,
} from "./persona-action";

type PersonaLikeButtonProps = PropsOf<typeof Button> & {
  personaId: string;
  likes: number;
  liked: boolean;
};

export function PersonaLikeButton(props: PersonaLikeButtonProps) {
  const likeAction = usePersonaLikeAction({
    personaId: props.personaId,
    likes: props.likes,
    liked: props.liked,
  });

  return (
    <Button
      color="danger"
      size="sm"
      variant="light"
      onPress={likeAction.onPress}
      isLoading={likeAction.loading}
      startContent={
        <Heart className={likeAction.liked ? "fill-current" : ""} size={12} />
      }
      {...props}
    >
      {likeAction.likes}
    </Button>
  );
}

type PersonaBookmarkButtonProps = PropsOf<typeof Button> & {
  personaId: string;
  bookmarked: boolean;
};

export function PersonaBookmarkButton(props: PersonaBookmarkButtonProps) {
  const bookmarkAction = usePersonaBookmarkAction({
    personaId: props.personaId,
    bookmarked: props.bookmarked,
  });

  return (
    <Button
      color="default"
      size="sm"
      variant="light"
      onPress={bookmarkAction.onPress}
      isLoading={bookmarkAction.loading}
      isIconOnly
      {...props}
    >
      <Bookmark
        className={bookmarkAction.bookmarked ? "fill-current" : ""}
        size={12}
      />
    </Button>
  );
}

type PersonaCreatorButtonProps = PropsOf<typeof Button> & {
  username: string;
};

export function PersonaCreatorButton({
  username,
  ...props
}: PersonaCreatorButtonProps) {
  return (
    <Button
      isDisabled
      variant="light"
      size="sm"
      className="text-xs text-foreground-500"
      {...props}
    >
      by {username}
    </Button>
  );
}
