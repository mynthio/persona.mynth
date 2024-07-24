"use client";

import { GetPersonasReturn } from "@/app/_services/personas.service";
import { fetcher } from "@/app/_utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import PublicPersonaCard from "./public-persona-card.client";
import { Pagination } from "@nextui-org/pagination";
import React from "react";
import { Spinner } from "@nextui-org/spinner";
import { PersonaContext } from "../persona/persona-context";

type Props = {
  personaPath?: string;
  showPagination?: boolean;
  overwriteFilters?: {
    nsfw?: boolean;
    promptId?: string;
    creatorId?: string;
    bookmarked?: boolean;
    published?: boolean;
    limit?: number;
  };
};

type Persona = {
  id: string;
  isLiked?: boolean;
  likes?: any[];
  bookmarks?: any[];
  isBookmarked?: boolean;
  likesCount?: number;
};

// export const PersonaContext = React.createContext<{
//   mutatePersona: (persona: Persona) => void;
// } | null>(null);

export default function Personas({
  overwriteFilters,
  personaPath,
  showPagination = true,
}: Props) {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page"));

  const { data, isLoading, mutate } = useSWR<{
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
        : `promptId=${searchParams.get("promptId") ?? ""}`
    }&creatorId=${
      overwriteFilters?.creatorId
        ? overwriteFilters.creatorId
        : searchParams.get("creatorId") ?? ""
    }&published=${
      overwriteFilters?.published === undefined
        ? searchParams.get("published") === "true"
        : overwriteFilters.published
    }&bookmarked=${
      overwriteFilters?.bookmarked === undefined
        ? searchParams.get("bookmarked") === "true"
        : overwriteFilters.bookmarked
    }`,
    fetcher,
  );

  // TODO: Fetch count separetely to avoid re-renders etc.
  const count = React.useMemo(() => data?.count || 0, [data]);

  const mutatePersona = (persona: Persona) => {
    mutate(
      (d) =>
        d
          ? {
              ...d,
              personas: d.personas.map((p) => {
                if (p.id === persona.id) {
                  return {
                    ...p,
                    ...persona,
                  };
                }

                return p;
              }),
            }
          : { personas: [], count: 0 },
      {
        revalidate: false,
      },
    );
  };

  return (
    <>
      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.personas.map((persona) => (
            <PersonaContext.Provider key={persona.id} value={{ mutate }}>
              <PublicPersonaCard
                path={personaPath || "/personas"}
                persona={{
                  ...persona,
                  isLiked: !!persona.likes?.length,
                  isBookmarked: !!persona.bookmarks?.length,
                }}
              />
            </PersonaContext.Provider>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center my-10">
          <Spinner color="secondary" size="lg" />
        </div>
      )}

      {showPagination && (
        <Pagination
          className="mt-6"
          showControls
          isDisabled={count < 21}
          total={Math.ceil(count / 20)}
          initialPage={page > 0 ? page : 1}
          page={page}
          color="secondary"
          onChange={(newPage) => {
            const sp = new URLSearchParams(searchParams);
            sp.set("page", newPage.toString());
            push(`?${sp.toString()}`);
          }}
        />
      )}
    </>
  );
}
