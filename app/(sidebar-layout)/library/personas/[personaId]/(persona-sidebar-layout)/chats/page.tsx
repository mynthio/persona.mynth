import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Chip } from "@nextui-org/chip";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Clock } from "lucide-react";
import NewChatButton from "./_components/new-chat-button";
import LocalChatButton from "./_components/local-chat-button";
import LocalChatItem from "./_components/local-chat-item";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";
import Link from "next/link";

dayjs.extend(relativeTime);

type Props = {
  params: {
    personaId: string;
  };
};

export default async function PersonaChatsPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return <div>You need to be signed in to see this page</div>; // TODO: Add some cool component for login on such pages

  const chats = await prisma.chat.findMany({
    where: {
      personaId: params.personaId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  return (
    <>
      <div className="flex justify-end w-full gap-4 items-center">
        <NewChatButton personaId={params.personaId} />
      </div>

      <hr className="my-6 border-foreground-100" />

      <LocalChatItem personaId={params.personaId} />

      {chats.map((chat) => (
        <section key={chat.id}>
          <Chip startContent={<Clock size={12} />} variant="light">
            {dayjs(chat.createdAt).fromNow()}
          </Chip>
          <h2 className="text-4xl font-thin text-foreground-500">
            <Link
              href={`/library/personas/${params.personaId}/chats/${chat.id}`}
            >
              {chat.name}
            </Link>
          </h2>
        </section>
      ))}

      {chats.length < 1 && (
        <div className="text-foreground-500 text-center mt-10">
          You have no chats saved in cloud yet
        </div>
      )}
    </>
  );
}
