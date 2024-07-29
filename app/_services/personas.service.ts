import "server-only";

import { prisma } from "@/prisma/client";
import { unstable_cache as cache } from "next/cache";

type GetPersonasArgs2 = {
  userId?: string | null;
  page: number;
  published: boolean;
  showNsfw: boolean;
  promptId?: string;
  creatorId?: string;
  limit?: number;
  bookmarked?: boolean;
};

const PER_PAGE = 24;

export const getPersonas = async (args: GetPersonasArgs2) => {
  return prisma.persona.findMany({
    where: {
      ...(args.published || !args.userId
        ? { published: true }
        : { creatorId: args.userId }),
      ...(args.showNsfw ? {} : { isNsfw: false }),
      ...(args.promptId ? { promptId: args.promptId } : {}),
      ...(args.creatorId ? { creatorId: args.creatorId } : {}),
      ...(args.bookmarked && args.userId
        ? { bookmarks: { some: { userId: args.userId } } }
        : {}),
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

export const getPersonaCount = async (args: GetPersonasArgs2) => {
  return prisma.persona.count({
    where: {
      ...(args.published || !args.userId
        ? { published: true }
        : { creatorId: args.userId }),
      ...(args.showNsfw ? {} : { isNsfw: false }),
      ...(args.promptId ? { promptId: args.promptId } : {}),
      ...(args.creatorId ? { creatorId: args.creatorId } : {}),
      ...(args.bookmarked && args.userId
        ? { bookmarks: { some: { userId: args.userId } } }
        : {}),
    },
  });
};

type GetPublicPersonaArgs = {
  personaId: string;
  userId?: string;
};

export const getPublicPersona = async (args: GetPublicPersonaArgs) =>
  cache(
    async ({ personaId }: GetPublicPersonaArgs) => {
      return prisma.persona.findUnique({
        where: {
          id: personaId,
          published: true,
        },
        include: {
          creator: {
            select: {
              username: true,
              imageUrl: true,
            },
          },
          ...(args.userId
            ? {
                likes: { where: { userId: args.userId } },
                bookmarks: { where: { userId: args.userId } },
              }
            : {}),
        },
      });
    },
    ["public-persona"],
    {
      tags: ["persona", `persona:${args.personaId}`],
      revalidate: 5 * 60,
    }
  )(args);

type GetPersonasArgs = {
  userId: string;
};

type GetPublicPersonasArgs = {
  userId?: string;
  filter?: "bookmarked";
  limit: number;
  cursor?: string;
};

export const getPublicPersonas = async ({
  userId,
  filter,
  limit,
  cursor,
}: GetPublicPersonasArgs) => {
  const results = await prisma.persona.findMany({
    where: {
      published: true,
      ...(filter === "bookmarked" && userId
        ? { bookmarks: { some: { userId } } }
        : {}),
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      summary: true,
      mainImageUrl: true,

      createdAt: true,
      publishedAt: true,

      personaGenerationId: true,

      likesCount: true,

      creator: {
        select: {
          username: true,
          imageUrl: true,
        },
      },

      ...(userId
        ? { likes: { where: { userId } }, bookmarks: { where: { userId } } }
        : {}),
    },
    take: limit,
    ...(cursor
      ? {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }
      : {}),
  });

  return results.map((result) => ({
    id: result.id,
    name: result.name,
    summary: result.summary,
    mainImageUrl: result.mainImageUrl,

    createdAt: result.createdAt,
    publishedAt: result.publishedAt,

    personaGenerationId: result.personaGenerationId,

    published: true,

    creator: result.creator,

    likesCount: result.likesCount,
    liked: result.likes.length > 0,

    bookmarked: result.bookmarks.length > 0,
  }));
};

export type GetPublicPersonasData = Awaited<
  ReturnType<typeof getPublicPersonas>
>;

export const getUserPersonas = cache(async (args: GetPersonasArgs) => {
  const results = await prisma.persona.findMany({
    where: {
      creatorId: args.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      summary: true,
      mainImageUrl: true,

      createdAt: true,
      publishedAt: true,

      personaGenerationId: true,

      likesCount: true,
      likes: { where: { userId: args.userId } },

      bookmarks: { where: { userId: args.userId } },

      published: true,
    },
  });

  return results.map((result) => ({
    id: result.id,
    name: result.name,
    summary: result.summary,
    mainImageUrl: result.mainImageUrl,

    personaGenerationId: result.personaGenerationId,

    published: result.published,
    publishedAt: result.publishedAt,

    bookmarked: result.bookmarks.length > 0,

    liked: result.likes.length > 0,
    likesCount: result.likesCount,
  }));
});

export type GetUserPersonasData = Awaited<ReturnType<typeof getUserPersonas>>;
