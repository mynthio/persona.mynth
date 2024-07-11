import { prisma } from "@/prisma/client";
import { redis } from "@/redis/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      promptId: string;
    };
  }
) {
  // If there is no signed in user, this will return a 404 error
  auth().protect();

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
    },
  });

  console.log(prompt, userId);

  if (!prompt) return Response.json({ pending: 0 });
  if (prompt.creatorId !== userId) return Response.json({ pending: 0 }); // TODO: Move to component or handle 404

  if (prompt.personaGenerations.length === 0)
    return Response.json({ pending: 0 });

  const personas = await Promise.all(
    prompt.personaGenerations.map(({ id }) =>
      redis
        .get(`persona_generation:${params.promptId}:${id}`)
        .then((result) => (result ? JSON.parse(result) : null))
    )
  );

  return Response.json({
    pending: prompt.personaGenerations.length,
    personasJobIds: prompt.personaGenerations.map((persona) => persona.id),
    personas,
  });
}
