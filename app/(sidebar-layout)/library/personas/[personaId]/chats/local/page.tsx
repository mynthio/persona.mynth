import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma/client";
import dynamic from "next/dynamic";
const Chat = dynamic(() => import("./chat.client"), { ssr: false });

type Props = {
  params: {
    personaId: string;
  };
};

export default async function PersonaLocalChatPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return <div>You need to be signed in to see this page</div>; // TODO: Add some cool component for login on such pages

  const persona = await prisma.persona.findUnique({
    where: {
      id: params.personaId,
      creatorId: userId,
    },
  });

  if (!persona) return <div>Persona not found</div>; // TODO: Move to component or handle 404

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-light text-foreground-500 text-center">
        Local chat with {persona.name}
      </h2>

      <Chat
        systemMessage={`You're playing the role of AI generated persona in roleplay chat with user. Answer the user question, talk with him, be creative and propose topics etc. 
          
Your character:
Name: ${persona.name}
Age: ${persona.age}
Occupation: ${persona.occupation}
Summary: ${persona.summary}
Personality traits: ${persona.personalityTraits}
Interests: ${persona.interests}
Cultural background: ${persona.culturalBackground}
Appearance: ${persona.appearance}
Background: ${persona.background}
History: ${persona.history}
Characteristics: ${persona.characteristics}`}
        personaId={persona.id}
        personaName={persona.name}
        personaImageUrl={persona.mainImageUrl}
        initialMessages={[]}
      />
    </div>
  );
}
