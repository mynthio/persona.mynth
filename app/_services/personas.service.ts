import "server-only";

import { prisma } from "@/prisma/client";

type GetPersonasArgs = {
  userId?: string | null;
  page: number;
  published: boolean;
  showNsfw: boolean;
  promptId?: string;
  creatorId?: string;
  limit?: number;
};

const PER_PAGE = 24;

export const getPersonas = async (args: GetPersonasArgs) => {
  return prisma.persona.findMany({
    where: {
      ...(args.published || !args.userId
        ? { published: true }
        : { creatorId: args.userId }),
      ...(args.showNsfw ? {} : { isNsfw: false }),
      ...(args.promptId ? { promptId: args.promptId } : {}),
      ...(args.creatorId ? { creatorId: args.creatorId } : {}),
    },
    include: {
      creator: {
        select: {
          username: true,
        },
      },
      ...(args.userId
        ? {
            likes: { where: { userId: args.userId } },
            bookmarks: { where: { userId: args.userId } },
          }
        : {}),
    },
    take: args.limit || PER_PAGE,
    skip: (args.page - 1) * (args.limit || PER_PAGE),
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

export type GetPersonasReturn = Awaited<ReturnType<typeof getPersonas>>;

export const getPersonaCount = async (args: GetPersonasArgs) => {
  return prisma.persona.count({
    where: {
      ...(args.published || !args.userId
        ? { published: true }
        : { creatorId: args.userId }),
      ...(args.showNsfw ? {} : { isNsfw: false }),
      ...(args.promptId ? { promptId: args.promptId } : {}),
      ...(args.creatorId ? { creatorId: args.creatorId } : {}),
    },
  });
};

type GetUserPersonasArgs = {
  userId: string;
  page: number;
};
