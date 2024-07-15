import { prisma } from "@/prisma/client";
import { redis } from "@/redis/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      promptId: string;
      generationId: string;
    };
  }
) {
  // If there is no signed in user, this will return a 404 error
  auth().protect();

  const { userId } = auth();
  if (!userId) return Response.json({ pending: 0 });

  const persona = await redis
    .get(`persona_generation:${params.promptId}:${params.generationId}`)
    .then((result) => (result ? JSON.parse(result) : null));

  return Response.json({
    status: persona?.status,
    persona: persona?.persona,
  });
}
