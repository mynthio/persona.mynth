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
  if (!userId) return Response.json({ pending: 0 });

  const pendingGenerations = await redis.keys(
    `persona_generation:${params.promptId}:*`
  );

  const prompt = await prisma.personaPrompt.findUnique({
    where: {
      id: params.promptId,
      creatorId: userId,
    },
    include: {
      personaGenerations: {
        include: {
          persona: true,
        },
        take: 20,
      },
    },
  });

  if (!prompt) return Response.json({ pending: 0, generations: [] });

  // const personas = await Promise.all(
  //   prompt.personaGenerations.map(({ id }) =>
  //     redis
  //       .get(`persona_generation:${params.promptId}:${id}`)
  //       .then((result) => (result ? JSON.parse(result) : null))
  //   )
  // );

  return Response.json({
    pending: pendingGenerations.length,
    personasJobIds: prompt.personaGenerations.map((persona) => persona.id),
    generations: prompt.personaGenerations,
  });
}
