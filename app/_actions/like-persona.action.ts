"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import "server-only";

export const likePersonaAction = async (personaId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.$transaction(async (tx) => {
    await tx.personaLike.create({
      data: {
        personaId,
        userId,
      },
    });

    await tx.persona.update({
      where: {
        id: personaId,
        published: true,
      },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });
  });

  // revalidatePath("/personas");
  // revalidatePath(`/personas/${personaId}`);
};
