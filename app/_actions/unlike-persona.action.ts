"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import "server-only";

export const unLikePersonaAction = async (personaId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.$transaction(async (tx) => {
    await tx.personaLike.delete({
      where: {
        personaId_userId: {
          personaId,
          userId,
        },
      },
    });

    await tx.persona.update({
      where: {
        id: personaId,
        published: true,
      },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
    });
  });

  revalidateTag("persona");
};
