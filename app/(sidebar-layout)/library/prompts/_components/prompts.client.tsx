"use client";

import { fetcher } from "@/app/_utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Pagination } from "@nextui-org/pagination";
import { Skeleton } from "@nextui-org/skeleton";
import { GetPersonaPromptsReturn } from "@/app/_services/persona-prompts.service";
import PromptCard from "./prompt-card.client";

export default function Prompts() {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);

  const { data, isLoading } = useSWR<{
    count: number;
    personaPrompts: GetPersonaPromptsReturn;
  }>(`/api/prompts?page=${page}`, fetcher);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isLoading ? (
          <Skeleton className="h-24 w-full rounded-lg" />
        ) : (
          data?.personaPrompts?.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))
        )}
      </div>

      <Pagination
        className="mt-4"
        initialPage={page}
        showControls
        color="secondary"
        total={isLoading ? 0 : Math.ceil(data?.count / 20)}
        page={page}
        onChange={(page) => {
          const sp = new URLSearchParams(searchParams);
          sp.set("page", page.toString());
          push(`/library/prompts?${sp.toString()}`);
        }}
      />
    </>
  );
}
