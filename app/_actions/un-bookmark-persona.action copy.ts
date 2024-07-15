"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import "server-only";

export const unBookmarkPersonaAction = async (personaId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.personaBookmark.delete({
    where: {
      personaId_userId: {
        personaId,
        userId,
      },
    },
  });

  revalidatePath(`/library/personas`);
  revalidatePath(`/library/personas/${personaId}`);
};
