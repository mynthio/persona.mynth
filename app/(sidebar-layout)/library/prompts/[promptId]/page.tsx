import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import GeneratePersonas from "./_components/generate-personas.client";
import PollPendingPersonas from "./_components/pending-persona-tile.client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import PendingPersonaTile from "./_components/pending-persona-tile.client";
import PersonaTile from "./_components/persona-tile.client";
import Personas from "@/app/_components/personas/personas.client";
import { CreatorPrompt, TextPrompt } from "@/schemas/create-prompt.schema";
import { redis } from "@/redis/client";
import got from "got";
import { Suspense } from "react";

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
        orderBy: {
          createdAt: "desc",
        },
        include: {
          persona: {
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
      },
    },
  });

  if (!prompt) return <div>Prompt not found</div>; // TODO: Move to component or handle 404

  const isPublic = prompt.isPublic;
  const isAuthor = prompt.creatorId === userId;

  if (!isAuthor && !isPublic) return <div>Prompt not found</div>; // TODO: Move to component or handle 404

  const input = prompt.input as Record<string, string>;

  const pendingGenerations = await redis.keys(
    `persona_generation:${prompt.id}:*`
  );

  const pendingInngestIds = pendingGenerations.map((key) => key.split(":")[2]);

  return (
    <div>
      <h3 className="text-large text-foreground-500 p-3">{prompt.name}</h3>

      <div className="mt-2 px-3">
        {Object.keys(input).map((inputKey) =>
          input[inputKey] ? (
            <>
              <p>
                <span className="text-foreground-600">
                  {inputKey === "textPrompt" ? "Prompt" : inputKey}
                </span>
                :{" "}
                {Array.isArray(input[inputKey])
                  ? input[inputKey].join(", ")
                  : input[inputKey]}
              </p>
            </>
          ) : null
        )}
      </div>

      <hr className="my-8 border-foreground-100" />

      <div>
        <h3 className="text-large text-foreground-500 p-3">Generate</h3>

        <div className="mt-2 px-3">
          <Suspense>
            <GeneratePersonas promptId={prompt.id} />
          </Suspense>
          <p className="mt-6 text-small text-foreground-500 max-w-xl">
            Generation may take a while (usually done in about a minute, but can
            be more if traffic is bigger). You can browse page or even close tab
            and come back later to check the results.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-large text-foreground-500 p-3">
          Generated Personas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {pendingGenerations.map((generationId) => (
            <PendingPersonaTile
              key={generationId}
              promptId={prompt.id}
              generationId={generationId.split(":")[2]}
            />
          ))}

          {prompt.personaGenerations.map(
            ({ id, inngestEventId, status, persona }) =>
              pendingInngestIds.includes(inngestEventId) ? null : (
                <PersonaTile key={persona!.id} persona={persona!} />
              )
          )}
        </div>
      </div>
    </div>
  );
}
