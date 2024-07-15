import { getPersonaComments } from "@/app/_services/persona-comments.service";

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
  const searchParams = new URL(request.url).searchParams;

  const cursor = searchParams.get("cursor");

  const comments = await getPersonaComments({
    personaId: params.personaId,
    cursor: cursor ? cursor : undefined,
    take: searchParams.get("direction") === "prev" ? -20 : 20,
  });

  return Response.json({ comments });
}
