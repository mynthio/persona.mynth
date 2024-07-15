import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Globe } from "lucide-react";
import PublishPersonaButton from "./_components/publish-persona-button.client";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/react";
import PersonaComments from "./_components/persona-comments.client";
import CreatePersonaCommentForm from "./_components/create-persona-comment-form.client";

type Props = {
  params: {
    personaId: string;
  };
};

export default async function PersonaPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return <div>You need to be signed in to see this page</div>; // TODO: Add some cool component for login on such pages

  const persona = await prisma.persona.findUnique({
    where: {
      id: params.personaId,
      published: true,
    },
  });

  if (!persona) return <div>Persona not found</div>; // TODO: Move to component or handle 404

  return (
    <Card className="bg-default-100/60 dark:bg-default-100/60" isBlurred>
      <CardHeader className="px-8 py-4 mt-6 justify-between items-center">
        <h2 className="text-2xl font-light text-foreground-500">
          {persona.name} ({persona.age})
        </h2>
      </CardHeader>

      <CardBody className="px-8 py-4">
        <div className="space-y-2 text-foreground-600">
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

        <h3 className="text-large text-foreground-500 p-3">Gallery</h3>

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

        <hr className="my-6 border-foreground-300" />

        <h3 className="text-large text-foreground-500 p-3">Comments</h3>

        <PersonaComments personaId={persona.id} />
        <hr className="my-2 border-transparent" />
        <CreatePersonaCommentForm personaId={persona.id} />
      </CardBody>
    </Card>
  );
}
