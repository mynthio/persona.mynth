import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import Chat from "./chat.client";
import { Chip } from "@nextui-org/chip";
import { Avatar } from "@nextui-org/react";
import { TextGenerationModelsEnum } from "@/lib/ai/text-generation-models/enums/text-generation-models.enum";

export const maxDuration = 180;

type Props = {
  params: {
    personaId: string;
    chatId: string;
  };
};

export default async function ChatPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return <div>You need to be signed in to see this page</div>; // TODO: Add some cool component for login on such pages

  const persona = await prisma.persona.findUnique({
    where: {
      id: params.personaId,
      creatorId: userId,
    },
  });

  if (!persona) return <div>Persona not found</div>; // TODO: Move to component or handle 404

  const chat = await prisma.chat.findUnique({
    where: {
      id: params.chatId,
      personaId: persona.id,
      userId,
    },
    include: {
      messages: {
        where: {
          role: {
            not: "system",
          },
        },
        select: {
          id: true,
          role: true,
          versions: {
            where: {
              selected: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!chat) return <div>Chat not found</div>; // TODO: Move to component or handle 404

  const messages = chat.messages.map((m) => ({
    id: m.id,
    role: m.role as any,
    content: m.versions[0].content,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center">
        <Chip size="sm" color="danger">
          BETA
        </Chip>

        <Avatar
          size="lg"
          src={persona.mainImageUrl}
          alt={persona.name}
          className="mx-auto mt-10"
        />

        <h2 className="text-2xl font-light text-foreground-500 mt-4">
          Chat with {persona.name}
        </h2>

        <p className="text-small text-foreground-400 italic">
          Be aware of issues and bugs, as it's early beta stage
        </p>
      </div>

      <div className="mt-10">
        <Chat
          chatId={chat.id}
          personaName={persona.name}
          personaId={persona.id}
          model={chat.model as TextGenerationModelsEnum}
          userCharacter={
            JSON.parse(chat.userCharacter) as {
              name: string;
              character: string;
            }
          }
          personaImageUrl={persona.mainImageUrl}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}
