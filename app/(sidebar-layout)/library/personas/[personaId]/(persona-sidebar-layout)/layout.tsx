import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import PublishPersonaButton from "./_components/publish-persona-button.client";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import PersonaChat from "./_components/persona-chat.client";

import PersonaMenu from "./_components/persona-menu.client";

type Props = {
  children: React.ReactNode;
  params: {
    personaId: string;
  };
};

export default async function LibraryPersonaLayout({
  params,
  children,
}: Props) {
  const { userId } = auth();
  if (!userId) return <div>You need to be signed in to see this page</div>; // TODO: Add some cool component for login on such pages

  const persona = await prisma.persona.findUnique({
    where: {
      id: params.personaId,
      creatorId: userId,
    },
    include: {
      creator: true,
    },
  });

  if (!persona) return <div>Persona not found</div>; // TODO: Move to component or handle 404

  return (
    <>
      <div className="xl:flex gap-10">
        <div className="xl:max-w-sm">
          <Image
            isBlurred
            src={persona.mainImageUrl || ""}
            alt={persona.name}
            className="m-4 w-80 max-xl:w-52"
          />

          {/* <div className="px-4">
            <Chip size="sm" variant="light" className="text-foreground-500">
              {persona.published ? <Globe size={12} /> : <Lock size={12} />}
            </Chip>
            <Chip size="sm" variant="light" className="text-foreground-500">
              AI Generated
            </Chip>
            <Chip size="sm" variant="light" className="text-foreground-500">
              by {persona.creator.username}
            </Chip>
            <h1 className="text-3xl font-thin text-foreground-600 mt-2">
              {persona.name}
            </h1>
            <p className="font-light text-small text-foreground-500 max-w-xl mt-2">
              {persona.summary}
            </p>
          </div> */}

          <div className="m-4 w-full mt-10 space-x-2 xl:space-y-2 xl:space-x-0">
            <PersonaMenu personaId={persona.id} />
            {/* <Button
              as={Link}
              href={`/library/personas/${persona.id}`}
              variant="ghost"
              startContent={<BookUser size={12} />}
              className="xl:w-full"
            >
              Persona
            </Button>
            <Button
              as={Link}
              href={`/library/personas/${persona.id}/chats`}
              variant="ghost"
              endContent={<MessageSquare size={12} />}
              className="xl:w-full"
            >
              Chats
            </Button>
            <Button
              variant="ghost"
              endContent={<Images size={12} />}
              className="xl:w-full"
            >
              Gallery
            </Button>
            {persona.published ? (
              <Button
                as={Link}
                href={`/personas/${persona.id}`}
                variant="ghost"
                endContent={<ExternalLink size={12} />}
                className="xl:w-full"
              >
                Public version
              </Button>
            ) : (
              <PublishPersonaButton personaId={persona.id} />
            )} */}
          </div>
        </div>

        <div className="p-3 w-full mt-3">{children}</div>
      </div>
    </>
  );

  return (
    <Card className="bg-default-100/60 dark:bg-default-100/60" isBlurred>
      <CardHeader className="px-8 py-4 mt-6 justify-between items-center">
        <h2 className="text-2xl font-light text-foreground-500">
          {persona.name} ({persona.age})
        </h2>
        <div>
          {persona.published ? (
            <Link color="secondary" href={`/personas/${persona.id}`}>
              View public persona
            </Link>
          ) : (
            <PublishPersonaButton personaId={persona.id} />
          )}
        </div>
      </CardHeader>

      <CardBody className="px-8 py-4">
        <div>
          <PersonaChat personaId={persona.id} />
        </div>
        <div className="space-y-2 text-foreground-600 mt-6">
          <i className="text-foreground-600 font-light">{persona.summary}</i>
          <p>
            <b>Gender:</b> {persona.gender}
          </p>
          <p>
            <b>Occupation:</b> {persona.occupation}
          </p>
          <p>
            <b>Personality Traits:</b> {persona.personalityTraits}
          </p>
          <p>
            <b>Interests:</b> {persona.interests}
          </p>
          <p>
            <b>Cultural Background:</b> {persona.culturalBackground}
          </p>
          <p>
            <b>Appearance:</b> {persona.appearance}
          </p>
          <p>
            <b>Background:</b> {persona.background}
          </p>
          <p>
            <b>History:</b> {persona.history}
          </p>
          <p>
            <b>Characteristics:</b> {persona.characteristics}
          </p>
        </div>

        <hr className="my-6 border-foreground-300" />

        <h5 className="text-large">Gallery</h5>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          <Link
            href={persona.mainImageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="w-full object-cover"
              src={persona.mainImageUrl}
              alt={persona.name}
            />
          </Link>
        </div>

        <p className="text-foreground-600 mt-6">
          Soon, we will add possibility to generate more images for single
          persona.
        </p>
      </CardBody>
    </Card>
  );
}
