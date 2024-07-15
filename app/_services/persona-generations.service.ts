import { prisma } from "@/prisma/client";
import { unstable_cache as cache } from "next/cache";

export const countPersonaGenerations = async () =>
  cache(
    async () => prisma.personaGeneration.count(),
    ["persona-generations-count"],
    {
      revalidate: 3 * 60, // refresh every 3 minutes
    }
  )();
