"use server";

import { prisma } from "@/prisma/client";
import {
  UpdatePersonaInput,
  UpdatePersonaSchema,
} from "@/schemas/update-persona.schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import "server-only";
import { assert } from "superstruct";

export const updatePersonaAction = async (data: UpdatePersonaInput) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, UpdatePersonaSchema);

  await prisma.persona.update({
    where: {
      id: data.personaId,
      creatorId: userId,
      ...(data.published === true ? { original: true } : {}), // Allow publishing only if it's not a copy
    },
    data: {
      name: data.name,
      isNsfw: data.isNsfw,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
      mainImageUrl: data.mainImageUrl,
    },
  });

  revalidatePath(`/library/personas/${data.personaId}`);
  revalidateTag(`persona:${data.personaId}`);

  return {};
};
