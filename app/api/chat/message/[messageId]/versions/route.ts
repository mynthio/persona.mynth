import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      messageId: string;
    };
  }
) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const message = await prisma.chatMessage.findUnique({
    where: {
      id: params.messageId,
    },
    include: {
      versions: {
        orderBy: {
          selected: "desc",
        },
      },
    },
  });

  return Response.json({ data: message?.versions.map((v) => ({ ...v })) });
}
