"use client";

import { fetcher } from "@/app/_utils/utils";
import { Skeleton } from "@nextui-org/skeleton";
import useSWR from "swr";
import PersonaTile from "./persona-tile.client";
import React, { useMemo } from "react";

type Props = {
  promptId: string;
  generationId: string;
};

export default function PendingPersonaTile({ promptId, generationId }: Props) {
  const [persona, setPersona] = React.useState<any>(null);

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

  React.useEffect(() => {
    if (data?.persona) {
      setPersona(data.persona);
    }
  }, [data]);

  if (error) return <div>Error: {error.message}</div>;

  return persona ? (
    <PersonaTile persona={persona} />
  ) : (
    <Skeleton className="h-24 rounded-lg" />
  );
}
