import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button, Link, User } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";

import PersonaComments from "./_components/persona-comments.client";
import CreatePersonaCommentForm from "./_components/create-persona-comment-form.client";
import { getPublicPersona } from "@/app/_services/personas.service";
import { Metadata } from "next";
import { Copy, Earth, MessagesSquare } from "lucide-react";
import {
  PersonaBookmarkButton,
  PersonaLikeButton,
} from "@/app/_components/personas/persona-buttons.client";
import { auth } from "@clerk/nextjs/server";
import CopyPersonaButton from "./_components/copy-persona-button.client";

type Props = {
  params: {
    personaId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const persona = await getPublicPersona({ personaId: params.personaId });
  if (!persona)
    return {
      title: "Persona not found",
    };

  return {
    title: `${persona.name} by ${persona.creator.username} | Persona by mynth`,
    description: persona.summary,
    openGraph: {
      title: persona.name,
      description: persona.summary,
      images: [persona.mainImageUrl || ""],
      url: `https://persona.mynth.io/personas/${params.personaId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: persona.name,
      description: persona.summary,
      images: [persona.mainImageUrl || ""],
    },
  };
}

export default async function PersonaPage({ params }: Props) {
  const { userId } = auth();
  const persona = await getPublicPersona({
    personaId: params.personaId,
    userId: userId ?? undefined,
  });
  if (!persona) return <div>Persona not found</div>; // TODO: Move to component or handle 404

  return (
    <div className="xl:flex gap-10">
      <div className="xl:max-w-72 w-full">
        <Image
          isBlurred
          src={persona.mainImageUrl || ""}
          alt={persona.name}
          className="m-4 w-80 max-xl:w-52"
        />

        <div className="m-4 w-full mt-4 space-x-2 xl:space-y-2 xl:space-x-0">
          <div className="flex justify-between items-center">
            <User
              name={persona.creator.username}
              avatarProps={{
                size: "sm",
                src: persona.creator.imageUrl ?? undefined,
              }}
            />

            <div className="flex items-center gap-2 justify-end">
              <PersonaLikeButton
                className="bg-foreground-500/10"
                likes={persona.likesCount}
                personaId={persona.id}
                liked={persona.likes?.length > 0}
              />

              <PersonaBookmarkButton
                className="bg-foreground-500/10"
                bookmarked={persona.bookmarks?.length > 0}
                personaId={persona.id}
              />
            </div>
          </div>

          {userId && (
            <div className="pt-4">
              <CopyPersonaButton
                fullWidth
                variant="flat"
                personaId={persona.id}
                startContent={<Copy size={12} />}
              />
            </div>
          )}

          {/* TODO: <div className="pt-2">
            <Button variant="flat" fullWidth startContent={<Copy size={12} />}>
              Copy to library
            </Button>
            <p className="text-small text-foreground-500 text-balance text-center mt-4">
              To interact with public persona, copy it to your library first.
            </p>
          </div> */}
        </div>
      </div>

      <div className="w-full">
        <hr className="mt-6 border-none" />

        <div className="px-2">
          <h1 className="text-5xl font-thin text-foreground-600">
            {persona.name}
          </h1>
          <p className="font-light text-small text-foreground-500 max-w-xl mt-2">
            {persona.summary}
          </p>

          <ul className="font-light text-balance text-foreground-600  max-w-xl mt-4 space-y-2">
            <li>Age: {persona.age}</li>
            <li>Gender: {persona.gender}</li>
            <li>Occupations/Proffesions: {persona.occupation}</li>
            <li>Personality Traits: {persona.personalityTraits}</li>
            <li>Interests: {persona.interests}</li>
            <li>Appearance: {persona.appearance}</li>
            <li>Background: {persona.background}</li>
            <li>History: {persona.history}</li>
            <li>Characteristics: {persona.characteristics}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
