import { redis } from "@/redis/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      personaId: string;
    };
  }
) {
  const { userId } = auth();

  const { personaId } = params;

  const activeImageGenerations = await redis
    .get(`user:${userId}:personas:${personaId}:image-generation`)
    .then((value) => Number(value));

  return Response.json(activeImageGenerations || 0);
}
