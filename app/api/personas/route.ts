import { getPersonaCount, getPersonas } from "@/app/_services/personas.service";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page"));

  const showNsfw = searchParams.get("nswf") === "true";
  const promptId = searchParams.get("promptId") ?? undefined;
  const creatorId = searchParams.get("creatorId") ?? undefined;
  const bookmarked = searchParams.get("bookmarked") === "true";
  const published = searchParams.get("published") === "true";

  const { userId } = auth();

  if (!published && !userId) throw new Error("Not authorized");

  const [personas, count] = await Promise.all([
    getPersonas({
      userId,
      page,
      showNsfw,
      promptId,
      creatorId,
      published,
      bookmarked,
    }),
    getPersonaCount({
      userId,
      showNsfw,
      promptId,
      creatorId,
      page,
      published,
      bookmarked,
    }),
  ]);

  return Response.json({
    personas,
    count,
  });
}
