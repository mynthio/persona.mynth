import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button, Link, User } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";

import PersonaComments from "./_components/persona-comments.client";
import CreatePersonaCommentForm from "./_components/create-persona-comment-form.client";
import { getPublicPersona } from "@/app/_services/personas.service";
import { Metadata } from "next";
import {
  CalendarRange,
  Copy,
  Earth,
  MessagesSquare,
  NotepadText,
  PersonStanding,
} from "lucide-react";
import {
  PersonaBookmarkButton,
  PersonaLikeButton,
} from "@/app/_components/personas/persona-buttons.client";
import { auth } from "@clerk/nextjs/server";
import CopyPersonaButton from "./_components/copy-persona-button.client";
import { Suspense } from "react";
import PersonaComment from "./_components/persona-comment.client";

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

          <div className="pt-4">
            <CopyPersonaButton
              fullWidth
              variant="flat"
              personaId={persona.id}
              startContent={<Copy size={12} />}
              isDisabled={!userId}
            >
              {userId ? "Copy to your library" : "Sign in to copy"}
            </CopyPersonaButton>

            {persona.copiesCount > 0 && (
              <p className="text-center mt-4 text-balance text-foreground-500 text-small">
                {persona.copiesCount}{" "}
                {persona.copiesCount > 1 ? "copies" : "copy"}
              </p>
            )}
          </div>

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

      <div className="w-full max-w-xl">
        <hr className="mt-6 border-none" />

        <div className="px-2">
          <h1 className="text-5xl font-thin text-foreground-600">
            {persona.name}
          </h1>
          <p className="font-light text-small text-foreground-500 mt-2">
            <span className="capitalize mr-6">
              <PersonStanding className="inline mr-1" size={14} />
              {persona.gender}
            </span>
            <span>
              <CalendarRange className="inline mr-1" size={14} />
              {persona.age}
            </span>
          </p>

          <p className="font-light text-small text-foreground-500 mt-2 text-balance">
            <span>
              <NotepadText className="inline mr-1" size={14} />
              {persona.summary}
            </span>
          </p>

          <div className="text-foreground-600 mt-8 space-y-4">
            <section>
              <h2 className="text-xl font-light text-foreground-500">
                Occupations/Proffesions
              </h2>
              <p className="text-foreground-600 mt-1">{persona.occupation}</p>
            </section>

            <section>
              <h2 className="text-xl font-light text-foreground-500">
                Personality Traits
              </h2>
              <p className="text-foreground-600 mt-1">
                {persona.personalityTraits}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light text-foreground-500">
                Interests
              </h2>
              <p className="text-foreground-600 mt-1">{persona.interests}</p>
            </section>

            <section>
              <h2 className="text-xl font-light text-foreground-500">
                Appearance
              </h2>
              <p className="text-foreground-600 mt-1">{persona.appearance}</p>
            </section>

            <section>
              <h2 className="text-xl font-light text-foreground-500">
                Background
              </h2>
              <p className="text-foreground-600 mt-1">{persona.background}</p>
            </section>

            <section>
              <h2 className="text-xl font-light text-foreground-500">
                History
              </h2>
              <p className="text-foreground-600 mt-1">{persona.history}</p>
            </section>

            <section>
              <h2 className="text-xl font-light text-foreground-500">
                Characteristics
              </h2>
              <p className="text-foreground-600 mt-1">
                {persona.characteristics}
              </p>
            </section>
          </div>
        </div>

        <Suspense>
          <div className="mt-10">
            <PersonaComments personaId={persona.id} />
            <hr className="mt-6 border-none" />
            <CreatePersonaCommentForm personaId={persona.id} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
