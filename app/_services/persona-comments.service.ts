import { prisma } from "@/prisma/client";

type GetPersonaCommentsArgs = {
  personaId: string;
  cursor?: string;
  take?: number;
};

export const getPersonaComments = async (args: GetPersonaCommentsArgs) => {
  return prisma.comment.findMany({
    where: {
      personaId: args.personaId,
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
    orderBy: {
      createdAt: "desc",
    },
    take: args.take || 20,
    skip: args.cursor ? 1 : 0,
    ...(args.cursor
      ? {
          cursor: {
            id: args.cursor,
          },
        }
      : {}),
  });
};
