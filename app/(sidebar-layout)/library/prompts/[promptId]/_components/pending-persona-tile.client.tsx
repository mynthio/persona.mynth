"use client";

import { fetcher } from "@/app/_utils/utils";
import { Card, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import PersonaTile from "./persona-tile.client";

type Props = {
  promptId: string;
  generationId: string;
};

export default function PendingPersonaTile({ promptId, generationId }: Props) {
  const { data, error, isLoading } = useSWR(
    `/api/prompts/${promptId}/generations/${generationId}`,
    fetcher,
    {
      refreshInterval: (data) => {
        if (!data) return 5000;
        return data?.status === "done" ? 0 : 5000;
      },
    }
  );

  if (error) return <div>Error: {error.message}</div>;

  return data?.persona ? (
    <PersonaTile persona={data.persona} />
  ) : (
    <Skeleton className="h-24 rounded-lg" />
  );
}
