import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import GeneratePersonas from "./_components/generate-personas.client";
import PollPendingPersonas from "./_components/poll-pending-personas.client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

type Props = {
  params: {
    promptId: string;
  };
};

export default async function PromptPage({ params }: Props) {
  const { userId } = auth();

  const prompt = await prisma.personaPrompt.findUnique({
    where: {
      id: params.promptId,
    },
    include: {
      personaGenerations: {
        where: {
          status: "pending",
        },
      },
      personas: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          gender: true,
          age: true,
          summary: true,
          published: true,
          mainImageUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!prompt) return <div>Prompt not found</div>; // TODO: Move to component or handle 404

  const isPublic = prompt.isPublic;
  const isAuthor = prompt.creatorId === userId;

  if (!isAuthor && !isPublic) return <div>Prompt not found</div>; // TODO: Move to component or handle 404

  return (
    <div>
      <h1>{prompt.name}</h1>

      {prompt.personaGenerations.length > 0 && (
        <PollPendingPersonas
          promptId={prompt.id}
          ids={prompt.personaGenerations.map((persona) => persona.id)}
        />
      )}

      <div className="mt-10">
        <h5 className="mb-4 text-foreground-500 font-bold">
          Generate personas
        </h5>
        <GeneratePersonas promptId={prompt.id} />
      </div>

      <div className="mt-10">
        <h5 className="mb-4 text-foreground-500 font-bold">Personas</h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompt.personas.map((persona) => (
            <div key={persona.id}>
              <Card key={persona.id}>
                <CardHeader>{persona.name}</CardHeader>

                <CardBody>
                  <p>{persona.summary}</p>
                  <p>Age: {persona.age}</p>
                  <p>Gender: {persona.gender}</p>
                </CardBody>

                {persona.mainImageUrl && (
                  <Image
                    className="w-full object-cover"
                    src={persona.mainImageUrl}
                    alt={persona.name}
                  />
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
