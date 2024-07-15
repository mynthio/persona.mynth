import { Card, CardHeader, CardFooter } from "@nextui-org/card";
import PersonaBookmarkButton from "./persona-bookmark-button.client";
import PersonaLikeButton from "./persona-like-button.client";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/react";

type Props = {
  persona: {
    id: string;
    age: string;
    name: string;
    summary: string;
    personalityTraits: string;
    mainImageUrl: string | null;
    likesCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
    creator: {
      username: string;
    };
  };
};

export default function PublicPersonaCard({ persona }: Props) {
  return (
    <Card
      key={persona.id}
      isFooterBlurred
      className="h-[400px] dark:bg-default-100/60"
      isBlurred
    >
      <CardHeader className="block">
        <Link
          className="text-large font-medium text-foreground-600"
          href={`/personas/${persona.id}`}
        >
          {persona.name} ({persona.age})
        </Link>

        <p className="text-foreground-500">{persona.summary}</p>

        <p className="text-foreground-500 text-small">
          {persona.personalityTraits}
        </p>
      </CardHeader>

      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover object-center"
        src={persona.mainImageUrl || ""}
      />

      <CardFooter className="justify-between overflow-hidden py-1 absolute rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <div className="text-foreground-700 text-small">
          by {persona.creator.username}
        </div>
        <div className="flex items-center gap-2">
          <PersonaLikeButton
            personaId={persona.id}
            likesCount={persona.likesCount}
            isLiked={!!persona.isLiked}
          />
          <PersonaBookmarkButton
            personaId={persona.id}
            isBookmarked={!!persona.isBookmarked}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
