"use client";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";

// Dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Bookmark, Clock, Globe, Heart, Lock } from "lucide-react";
import Link from "next/link";
import {
  usePersonaBookmarkAction,
  usePersonaLikeAction,
  usePersonaLikeButton,
} from "./persona-action";
import { PropsOf } from "@nextui-org/system";

dayjs.extend(relativeTime);

type Persona = {
  id: string;
  name: string;
  summary: string;
  createdAt: string;
  published: boolean;
  publishedAt: string;
  likesCount: number;
  mainImageUrl: string;
};

type PersonaCreator = {
  username: string;
  imageUrl?: string;
};

/**

  HEADER

*/
type PersonaCardHeaderProps = {
  chips: PersonaCardHeaderChip[];
};

function PersonaCardHeader({ chips }: PersonaCardHeaderProps) {
  return (
    <CardHeader className="absolute z-10 top-0 left-0 right-0 flex-col pb-6 !items-start rounded-none">
      <div className="flex items-center gap-1 text-foreground-700 text-small">
        {chips.map((chip, index) => (
          <Chip
            key={index}
            className={cn(
              "bg-default-50/40 backdrop-blur-sm",
              chip.icon && chip.label && "pl-2"
            )}
            variant="light"
            startContent={chip.label ? chip.icon : null}
          >
            {chip.label || chip.icon}
          </Chip>
        ))}
      </div>
    </CardHeader>
  );
}

/**

  FOOTER

*/
type PersonaCardFooterProps = {
  className?: string;
  creator: PersonaCreator;
  likesCount: number;
  liked: boolean;
  personaId: string;
  bookmarked: boolean;
};

type PersonaLikeButtonProps = PropsOf<typeof Button> & {
  personaId: string;
  likes: number;
  liked: boolean;
};

function PersonaLikeButton(props: PersonaLikeButtonProps) {
  const likeAction = usePersonaLikeAction({
    personaId: props.personaId,
    likes: props.likes,
    liked: props.liked,
  });

  return (
    <Button
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

function PersonaBookmarkButton(props: PersonaBookmarkButtonProps) {
  const bookmarkAction = usePersonaBookmarkAction({
    personaId: props.personaId,
    bookmarked: props.bookmarked,
  });

  return (
    <Button
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

export function PersonaCardFooter({
  likesCount,
  liked,
  creator,
  className,
  personaId,
  bookmarked,
}: PersonaCardFooterProps) {
  return (
    <CardFooter
      className={cn(
        "justify-between overflow-hidden px-0 py-0.5 absolute rounded-large bottom-1 w-[calc(100%_-_32px)] shadow-small ml-4 z-10",
        className
      )}
    >
      <Button
        disabled
        size="sm"
        variant="light"
        className="text-xs text-foreground-500"
      >
        by {creator.username}
      </Button>
      <div className="flex items-center gap-2">
        <PersonaLikeButton
          personaId={personaId}
          likes={likesCount}
          liked={liked}
          color="danger"
          size="sm"
          variant="light"
        />

        <PersonaBookmarkButton
          personaId={personaId}
          bookmarked={bookmarked}
          color="default"
          size="sm"
          variant="light"
        />
      </div>
    </CardFooter>
  );
}

type Props = {
  className?: string;
  persona: Persona;
  creator: PersonaCreator;
};

type PersonaCardHeaderChip = {
  label?: String;
  icon?: React.ReactNode;
};

export default function PersonaCard(props: Props) {
  const { persona, creator } = props;

  return (
    <Card
      className={cn("h-[400px] overflow-hidden", props.className)}
      isFooterBlurred
    >
      <PersonaCardHeader
        chips={[
          {
            label: "AI",
          },
          {
            label: dayjs(persona.createdAt).fromNow(),
            icon: <Clock size={14} />,
          },
        ]}
      />

      {/* <CardBody className="overflow-hidden p-0"> */}
      <Image
        removeWrapper
        loading="lazy"
        alt={`Persona ${persona.name} main image`}
        className="z-0 w-full h-full object-cover"
        src={persona.mainImageUrl}
      />

      <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <CardBody className="absolute bg-transparent bottom-5 m-0 left-0 right-0 md:p-6 w-auto rounded-t-xl z-10 flex-col h-32">
        <Link
          href={`/personas/${persona.id}`}
          className="text-white font-medium text-2xl w-full overflow-hidden truncate whitespace-nowrap"
        >
          {persona.name}
        </Link>

        <p className="text-small text-white/60 overflow-hidden whitespace-break-spaces mt-1 line-clamp-2 w-full">
          {persona.summary}
        </p>
      </CardBody>

      <PersonaCardFooter
        creator={creator}
        likesCount={persona.likesCount}
        liked={persona?.likes?.length > 0}
        personaId={persona.id}
        bookmarked={persona?.bookmarks?.length > 0}
      />
    </Card>
  );
}
