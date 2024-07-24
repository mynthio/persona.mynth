import { PERSONAS_PER_PAGE } from "@/app/_config/constants";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId } = auth();

  // Search params
  const { searchParams } = new URL(request.url);

  const parsedSearchParams = {
    cursor: searchParams.get("cursor") ?? undefined,
    limit: Number(searchParams.get("limit") ?? PERSONAS_PER_PAGE),
    filter: searchParams.get("filter"),
  };

  const cursor = parsedSearchParams.cursor;
  const limit =
    parsedSearchParams.limit > 0 && parsedSearchParams.limit < PERSONAS_PER_PAGE
      ? parsedSearchParams.limit
      : PERSONAS_PER_PAGE;

  const filter = parsedSearchParams.filter;

  const personas = await prisma.persona.findMany({
    where: {
      published: true,
      ...(filter === "bookmarked" && userId
        ? { bookmarks: { some: { userId } } }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      creator: true,
      ...(userId ? { likes: { where: { userId } } } : {}),
      ...(userId ? { bookmarks: { where: { userId } } } : {}),
    },
    take: limit < PERSONAS_PER_PAGE && limit > 1 ? limit : PERSONAS_PER_PAGE,
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
