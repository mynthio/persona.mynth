import { prisma } from "@/prisma/client";
import { unstable_cache as cache } from "next/cache";

type GetPersonaChatArgs = {
  chatId: string;
  userId: string;
};

export const getPersonaChat = (args: GetPersonaChatArgs) =>
  cache(
    async (args: GetPersonaChatArgs) => {
      const chat = await prisma.chat.findUnique({
        where: {
          id: args.chatId,
          userId: args.userId,
        },
      });

      return chat
        ? {
            id: chat?.id,
          }
        : null;
    },
    ["persona-chat"],
    {
      revalidate: 60 * 60, // 1 hour
    }
  )(args);
