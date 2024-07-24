"use client";

import { PERSONAS_PER_PAGE } from "@/app/_config/constants";
import useSWRInfinite from "swr/infinite";
import { WindowVirtualizer } from "virtua";
import PersonaCard from "./persona-card";
import { cn } from "@/lib/utils";
import {
  GetPublicPersonasData,
  GetUserPersonasData,
} from "@/app/_services/personas.service";
import { useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/button";

type PersonasData = GetUserPersonasData | GetPublicPersonasData;

type PersonasProps = {
  className?: string;
  prefetchedData?: PersonasData;
};

const getKey =
  (searchParams: URLSearchParams) =>
  (pageIndex: number, previousPageData: any) => {
    // reached the end
    if (previousPageData && !previousPageData.data) return null;

    // first page, we don't have `previousPageData`
    if (pageIndex === 0)
      return `/api/personas?limit=${PERSONAS_PER_PAGE}&filter=${searchParams.get(
        "filter"
      )}`;

    return `/api/personas?cursor=${
      previousPageData.nextCursor
    }&limit=${PERSONAS_PER_PAGE}&filter=${searchParams.get("filter")}`;
  };

export default function Personas(props: PersonasProps) {
  const searchParams = useSearchParams();

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite<{ data: PersonasData }>(getKey(searchParams), {
      fallbackData: props.prefetchedData
        ? [{ data: props.prefetchedData }]
        : [],
    });

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (data && data[data.length - 1]?.data?.length < PERSONAS_PER_PAGE);

  return (
    <>
      <WindowVirtualizer itemSize={400}>
        <div className={cn(props.className)}>
          {data?.map((page) =>
            page.data?.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                creator={persona.creator}
              />
            ))
          )}
        </div>
      </WindowVirtualizer>

      <div className="flex justify-center mt-4">
        <Button
          isDisabled={!isLoadingMore && isReachingEnd}
          isLoading={isLoadingMore}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "Loading..."
            : isReachingEnd
            ? "No more personas"
            : "Load more"}
        </Button>
      </div>
    </>
  );
}
