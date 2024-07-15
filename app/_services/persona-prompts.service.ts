import { prisma } from "@/prisma/client";

type getUserPersonaPromptsArgs = {
  userId: string;
  page: number;
};

const PER_PAGE = 20;

export const getUserPersonaPrompts = (args: getUserPersonaPromptsArgs) => {
  return prisma.personaPrompt.findMany({
    where: {
      creatorId: args.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          personaGenerations: true,
        },
      },
    },
    take: PER_PAGE,
    skip: (args.page - 1) * PER_PAGE,
  });
};

export type GetPersonaPromptsReturn = Awaited<
  ReturnType<typeof getUserPersonaPrompts>
>;

export const getUserPersonaPromptsCount = (args: getUserPersonaPromptsArgs) => {
  return prisma.personaPrompt.count({
    where: {
      creatorId: args.userId,
    },
  });
};
