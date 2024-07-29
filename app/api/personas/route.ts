import { PERSONAS_PER_PAGE } from "@/app/_config/constants";
import { getPublicPersonas } from "@/app/_services/personas.service";
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

  const filter = parsedSearchParams.filter ?? undefined;

  const personas = await getPublicPersonas({
    userId: userId ?? undefined,
    filter: filter as "bookmarked" | undefined,
    limit,
    cursor,
  });

  return Response.json({
    data: personas,
    nextCursor: personas.length === limit ? personas[limit - 1].id : null,
  });
}
