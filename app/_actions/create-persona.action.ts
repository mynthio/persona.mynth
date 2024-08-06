"use server";

import { prisma } from "@/prisma/client";
import {
  CreatePersonaData,
  CreatePersonaSchema,
} from "@/schemas/create-persona.schema";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export const createPersonaAction = async (data: CreatePersonaData) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");

  assert(data, CreatePersonaSchema);

  const persona = await prisma.persona.create({
    data: {
      ...data,
      culturalBackground: "-",
      creatorId: userId,
    },
  });

  return persona;
};
