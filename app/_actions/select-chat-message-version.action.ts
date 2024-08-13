"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import "server-only";

export const selectChatMessageVersionAction = async (data: {
  messageId: string;
  versionId: string;
}) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  await prisma.chatMessage.update({
    where: {
      id: data.messageId,
      chat: {
        userId,
      },
    },
    data: {
      versions: {
        updateMany: {
          where: {
            selected: true,
          },
          data: {
            selected: false,
          },
        },
        update: {
          where: {
            id: data.versionId,
          },
          data: {
            selected: true,
          },
        },
      },
    },
  });
};
