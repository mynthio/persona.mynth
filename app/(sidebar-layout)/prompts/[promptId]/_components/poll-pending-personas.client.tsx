"use client";

import { fetcher } from "@/app/_utils/utils";
import { Card, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { useRouter } from "next/navigation";
import useSWR from "swr";

type Props = {
  promptId: string;
  ids: string[];
};

export default function PollPendingPersonas({ promptId }: Props) {
  const { data, error, isLoading } = useSWR(
    `/api/prompts/${promptId}/pending-personas`,
    fetcher,
    {
      refreshInterval: (data) => {
        if (!data) return 5000;
        return data.pending === 0 ? 0 : 5000;
      },
    }
  );

  if (data && data.pending === 0) return null;

  if (error) return <div>Error: {error.message}</div>;

  const personas =
    data?.personas.filter((persona) => persona?.status === "pending") ?? [];

  if (personas.length === 0) return null;

  return (
    <>
      <h5 className="mb-4 text-foreground-500 font-bold text-large">
        Pending personas
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personas.map((persona) => {
          if (persona?.status === "pending") {
            return (
              <Skeleton key={persona.personaId} className="h-24 rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
              </Skeleton>
            );
          }

          return (
            <Card key={persona?.id}>{JSON.stringify(persona?.persona)}</Card>
          );
        })}
      </div>
    </>
  );
}
