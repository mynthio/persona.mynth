"use server";

import { prisma } from "@/prisma/client";
import { UpdatePersonaSchema } from "@/schemas/update-persona.schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import "server-only";
import { assert } from "superstruct";

export const updatePersonaAction = async (data: unknown) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, UpdatePersonaSchema);

  console.log(data);

  await prisma.persona.update({
    where: {
      id: data.personaId,
      creatorId: userId,
    },
    data: {
      name: data.name,
      isNsfw: data.isNsfw,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath(`/library/personas/${data.personaId}`);

  return {};
};
