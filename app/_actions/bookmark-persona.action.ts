"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import "server-only";

export const bookmarkPersonaAction = async (personaId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.personaBookmark.create({
    data: {
      personaId,
      userId,
    },
  });

  revalidatePath(`/library/personas`);
  revalidatePath(`/library/personas/${personaId}`);
};
