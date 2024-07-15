"use client";

import { GetPersonasReturn } from "@/app/_services/personas.service";
import { fetcher } from "@/app/_utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import PublicPersonaCard from "./public-persona-card.client";
import { Pagination } from "@nextui-org/pagination";
import React from "react";

// Accept personas fetched from server component
type Props = {
  overwriteFilters?: {
    nsfw?: boolean;
    promptId?: string;
    creatorId?: string;
    published?: boolean;
  };
};

export default function Personas({ overwriteFilters }: Props) {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  console.log({ searchParams: searchParams.get("nsfw") });

  const page = Number(searchParams.get("page"));

  const { data, isLoading } = useSWR<{
    count: number;
    personas: GetPersonasReturn;
  }>(
    `/api/personas?page=${page > 0 ? page : 1}&nswf=${
      overwriteFilters?.nsfw === undefined
        ? searchParams.get("nsfw") === "true"
        : overwriteFilters.nsfw
    }&${
      overwriteFilters?.promptId
        ? `promptId=${overwriteFilters.promptId}`
        : `promptId=${searchParams.get("promptId")}`
    }&creatorId=${
      overwriteFilters?.creatorId
        ? overwriteFilters.creatorId
        : searchParams.get("creatorId")
    }&published=${
      overwriteFilters?.published === undefined
        ? searchParams.get("published") === "true"
        : overwriteFilters.published
    }`,
    fetcher
  );

  // TODO: Fetch count separetely to avoid re-renders etc.
  const count = React.useMemo(() => data?.count || 0, [data]);

  return (
    <>
      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.personas.map((persona) => (
            <PublicPersonaCard
              key={persona.id}
              persona={{
                ...persona,
                isLiked: !!persona.likes?.length,
                isBookmarked: !!persona.bookmarks?.length,
              }}
            />
          ))}
        </div>
      )}

      <Pagination
        className="mt-6"
        showControls
        total={Math.ceil(count / 20)}
        initialPage={page > 0 ? page : 1}
        color="secondary"
        onChange={(newPage) => {
          const sp = new URLSearchParams(searchParams);
          sp.set("page", newPage.toString());
          push(`/personas?${sp.toString()}`);
        }}
      />
    </>
  );
}
