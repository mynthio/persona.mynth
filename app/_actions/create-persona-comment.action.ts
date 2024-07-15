"use server";

import { prisma } from "@/prisma/client";
import { CreatePersonaCommentSchema } from "@/schemas/create-persona-comment.schema";
import { auth } from "@clerk/nextjs/server";
import "server-only";
import { assert } from "superstruct";

export const createPersonaCommentAction = async (data: unknown) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authorized");

  assert(data, CreatePersonaCommentSchema);

  const publicPersona = await prisma.persona.findUnique({
    where: {
      id: data.personaId,
      published: true,
    },
  });

  if (!publicPersona) throw new Error("Public Persona not found");

  const comment = await prisma.comment.create({
    data: {
      persona: {
        connect: {
          id: data.personaId,
        },
      },
      content: data.content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
    },
  });

  return {
    comment,
  };
};
