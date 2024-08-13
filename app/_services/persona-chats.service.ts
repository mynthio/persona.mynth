import "server-only";
import { prisma } from "@/prisma/client";

type GetPersonaChatArgs = {
  chatId: string;
  userId: string;
};

export const getPersonaChat = async (args: GetPersonaChatArgs) => {
  const chat = await prisma.chat.findUnique({
    where: {
      id: args.chatId,
      userId: args.userId,
    },
    include: {
      messages: {
        where: {
          role: {
            not: "system",
          },
        },
        include: {
          versions: {
            where: {
              selected: true,
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 25,
      },
    },
  });

  return chat ? chat : null;
};
