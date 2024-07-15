"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { User } from "@nextui-org/user";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
dayjs.extend(relativeTime);

type Props = {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      username: string;
      imageUrl?: string;
    };
  };
};

export default function PersonaComment({ comment }: Props) {
  return (
    <Card className="bg-default-100/60 dark:bg-default-100/60" isBlurred>
      <CardBody>
        <p className="p-2 text-foreground-600">{comment.content}</p>
      </CardBody>

      <CardFooter>
        <User
          name={comment.user.username}
          description={dayjs(comment.createdAt).fromNow()}
          avatarProps={{
            src: comment.user.imageUrl,
          }}
        />
      </CardFooter>
    </Card>
  );
}
