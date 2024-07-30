"use server";

import { prisma } from "@/prisma/client";
import { CopyPersonaSchema } from "@/schemas/copy-persona.schema";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import "server-only";
import { assert } from "superstruct";

export const copyPersonaAction = async (data: unknown) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, CopyPersonaSchema);

  const personaToCopy = await prisma.persona.findUnique({
    where: {
      id: data.personaId,
      OR: [
        {
          creatorId: userId,
        },
        {
          published: true,
        },
      ],
    },
  });

  if (!personaToCopy) throw new Error("Persona not found");

  const newPersona = await prisma.persona.create({
    data: {
      name: personaToCopy.name,
      age: personaToCopy.age,
      occupation: personaToCopy.occupation,
      personalityTraits: personaToCopy.personalityTraits,
      appearance: personaToCopy.appearance,
      background: personaToCopy.background,
      history: personaToCopy.history,
      characteristics: personaToCopy.characteristics,
      culturalBackground: personaToCopy.culturalBackground,
      gender: personaToCopy.gender,
      interests: personaToCopy.interests,
      summary: personaToCopy.summary,
      mainImageUrl: personaToCopy.mainImageUrl,
      consistencyId: personaToCopy.consistencyId,
      creator: {
        connect: {
          id: userId,
        },
      },
      original: false,
      originalPersona: {
        connect: {
          id: personaToCopy.id,
        },
      },
    },
  });

  await prisma.persona.update({
    where: {
      id: personaToCopy.id,
    },
    data: {
      copiesCount: {
        increment: 1,
      },
    },
  });

  revalidateTag(`persona:${data.personaId}`);

  return {
    originalPersonaId: personaToCopy.id,
    copiedPersonaId: newPersona.id,
  };
};
