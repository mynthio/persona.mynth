import { getPersonaComments } from "@/app/_services/persona-comments.service";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      imageId: string;
    };
  }
) {
  const { userId } = auth();

  const image = await prisma.image.findUnique({
    where: {
      id: params.imageId,
    },
  });

  if (!image) throw new Error("Image not found");

  if (image.public === false && image.creatorId !== userId)
    throw new Error("Image not found");

  return Response.json({ image });
}
