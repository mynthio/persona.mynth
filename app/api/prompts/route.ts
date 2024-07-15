import {
  getUserPersonaPrompts,
  getUserPersonaPromptsCount,
} from "@/app/_services/persona-prompts.service";

import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page"));
  // TODO: const showNsfw = searchParams.get("nswf") === "true";

  const { userId } = auth();

  const personaPromptsPromise = userId
    ? getUserPersonaPrompts({ userId, page })
    : [];

  const countPromise = userId
    ? getUserPersonaPromptsCount({ userId, page })
    : 0;

  const [personaPrompts, count] = await Promise.all([
    personaPromptsPromise,
    countPromise,
  ]);

  return Response.json({
    personaPrompts,
    count,
  });
}
