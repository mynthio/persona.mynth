"use client";

import useSWR from "swr";
import PersonaComment from "./persona-comment.client";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  personaId: string;
};

export default function PersonaComments({ personaId }: Props) {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useSWR(
    `/api/personas/${personaId}/comments?cursor=${
      searchParams.get("cursor") || ""
    }&direction=${searchParams.get("direction") || "next"}`
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No comments</div>;

  return (
    <div className="space-y-2">
      {data.comments.map((comment: any) => (
        <PersonaComment key={comment.id} comment={comment} />
      ))}

      {/* Improve cursor pagination for the last page */}
      <div className="flex gap-2">
        <Button
          isDisabled={data.comments.length === 0 || !searchParams.get("cursor")}
          onClick={() => {
            const sp = new URLSearchParams(searchParams);
            sp.set("cursor", data.comments[0].id);
            sp.set("direction", "prev");
            push(`?${sp.toString()}`, {
              scroll: false,
            });
          }}
          isIconOnly
        >
          <ChevronLeft size={12} />
        </Button>

        <Button
          isDisabled={data.comments.length < 20}
          onClick={() => {
            const sp = new URLSearchParams(searchParams);
            sp.set("cursor", data.comments[data.comments.length - 1].id);
            sp.set("direction", "next");
            push(`?${sp.toString()}`, {
              scroll: false,
            });
          }}
          isIconOnly
        >
          <ChevronRight size={12} />
        </Button>
      </div>
    </div>
  );
}
