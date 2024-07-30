import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/prisma/client";
import { PERSONAS_PER_PAGE } from "@/app/_config/constants";
import { getUserPersonas } from "@/app/_services/personas.service";

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  // Search params
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit"));
  const cursor = searchParams.get("cursor");

  // const personas = await prisma.persona.findMany({
  //   where: {
  //     creatorId: userId,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   include: {
  //     _count: {
  //       select: {
  //         chats: true,
  //       },
  //     },
  //   },
  //   take: limit < MAX_LIMIT && limit > 1 ? limit : MAX_LIMIT,
  //   ...(cursor
  //     ? {
  //         cursor: {
  //           id: cursor,
  //         },
  //         skip: 1,
  //       }
  //     : {}),
  // });

  const personas = await getUserPersonas({
    userId,
    limit: limit < PERSONAS_PER_PAGE && limit > 1 ? limit : PERSONAS_PER_PAGE,
    cursor: cursor ? cursor : undefined,
  });

  return Response.json({
    data: personas,
    nextCursor: personas.length === limit ? personas[limit - 1].id : null,
  });
}
