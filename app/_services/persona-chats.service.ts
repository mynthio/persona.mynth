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
      persona: true,
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 25,
      },
    },
  });

  return chat ? chat : null;
};
