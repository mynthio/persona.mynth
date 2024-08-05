import { redis } from "@/redis/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      personaId: string;
      eventId: string;
    };
  }
) {
  const { userId } = auth();
  const { personaId, eventId } = params;

  const imageGenerationEvent = await redis
    .get(`user:${userId}:personas:${personaId}:image-generation:${eventId}`)
    .then((value) => (value ? JSON.parse(String(value)) : null));

  return Response.json({
    status: imageGenerationEvent?.status as "done" | "pending" | "queued",
    imageUrl: imageGenerationEvent?.imageUrl as string | undefined | null,
    id: imageGenerationEvent?.id as string | undefined | null,
  });
}
