import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/prisma/client";

const MAX_LIMIT = 30;

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  // Search params
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit"));
  const cursor = searchParams.get("cursor");

  const personas = await prisma.persona.findMany({
    where: {
      creatorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit < MAX_LIMIT && limit > 1 ? limit : MAX_LIMIT,
    ...(cursor
      ? {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }
      : {}),
  });

  return Response.json({
    data: personas,
    nextCursor: personas.length === limit ? personas[limit - 1].id : null,
  });
}
