import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import PublishPersonaButton from "./_components/publish-persona-button.client";
import { Image } from "@nextui-org/image";
import Link from "next/link";

import PersonaMenu from "./_components/persona-menu.client";
import { Button } from "@nextui-org/button";
import { Earth, MessagesSquare, Terminal } from "lucide-react";
import NewChatButton from "./chats/_components/new-chat-button";

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
      chats: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
      personaGeneration: {
        select: {
          promptId: true,
        },
      },
    },
  });

  if (!persona) return <div>Persona not found</div>; // TODO: Move to component or handle 404

  return (
    <>
      <div className="xl:flex gap-10">
        <div className="xl:max-w-sm sm:flex max-xl:gap-4 xl:block">
          <Image
            isBlurred
            src={persona.mainImageUrl || ""}
            alt={persona.name}
            className="m-4 w-80 sm:w-full max-xl:w-52 xl:max-w-64"
          />

          <div className="m-4 max-xl:max-w-60 w-full mt-4 flex sm:flex-col flex-wrap gap-2">
            {persona.chats.length > 0 ? (
              <Button
                as={Link}
                href={`/library/personas/${persona.id}/chats`}
                variant="light"
                startContent={<MessagesSquare size={12} />}
                className="xl:w-full bg-foreground-400/20"
              >
                Continue chat
              </Button>
            ) : (
              <NewChatButton personaId={persona.id} />
              // <Button
              //   as={Link}
              //   href={`/library/personas/${persona.id}`}
              //   variant="light"
              //   startContent={<MessagesSquare size={12} />}
              //   className="xl:w-full bg-foreground-400/20"
              // >
              //   Start chatting
              // </Button>
            )}

            {persona.original &&
              (persona.published ? (
                <Button
                  as={Link}
                  href={`/personas/${persona.id}`}
                  variant="light"
                  startContent={<Earth size={12} />}
                  className="xl:w-full text-foreground-700"
                >
                  View public persona
                </Button>
              ) : (
                <PublishPersonaButton
                  personaId={persona.id}
                  variant="light"
                  startContent={<Earth size={12} />}
                  className="xl:w-full text-foreground-700"
                >
                  Publish Persona
                </PublishPersonaButton>
              ))}

            {!persona.original && (
              <Button
                as={Link}
                href={`/personas/${persona.originalPersonaId}`}
                variant="light"
              >
                View original persona
              </Button>
            )}

            {persona.personaGeneration?.promptId && (
              <Button
                as={Link}
                href={`/library/prompts/${persona.personaGeneration.promptId}`}
                variant="light"
                startContent={<Terminal size={12} />}
                className="xl:w-full text-foreground-700"
              >
                View prompt
              </Button>
            )}
          </div>
        </div>

        <div className="w-full">
          <PersonaMenu personaId={persona.id} />

          <hr className="mt-6 border-none" />

          <div className="px-2">{children}</div>
        </div>
      </div>
    </>
  );
}
