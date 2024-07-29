import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";

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
      creatorId: userId,
    },
    include: {
      creator: true,
    },
  });

  if (!persona) return <div>Persona not found</div>; // TODO: Move to component or handle 404

  return (
    <>
      <h1 className="text-5xl font-thin text-foreground-600">{persona.name}</h1>
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
    </>
  );
}
