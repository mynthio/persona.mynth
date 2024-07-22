import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import Chat from "./chat.client";
import { Chip } from "@nextui-org/chip";

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
      messages: true,
    },
  });

  if (!chat) return <div>Chat not found</div>; // TODO: Move to component or handle 404

  return (
    <div>
      <div className="flex items-start gap-2">
        <Chip size="sm" color="danger">
          BETA
        </Chip>
        <h2 className="text-2xl font-light text-foreground-500">
          Chat with {persona.name}
        </h2>
      </div>
      <p className="text-small text-foreground-500 italic mt-1">
        Be aware of issues and bugs, as it's early beta stage
      </p>

      <div className="mt-10">
        <Chat
          chatId={chat.id}
          personaName={persona.name}
          personaImageUrl={persona.mainImageUrl}
          initialMessages={chat.messages.map((m) => ({
            role: m.role as any,
            content: m.content,
          }))}
        />
      </div>
    </div>
  );
}
