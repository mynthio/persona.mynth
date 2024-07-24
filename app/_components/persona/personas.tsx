import { PERSONAS_PER_PAGE } from "@/app/_config/constants";
import useSWRInfinite from "swr/infinite";
import { WindowVirtualizer } from "virtua";
import PersonaCard from "./persona-card";
import { cn } from "@/lib/utils";
import {
  GetPublicPersonasData,
  GetUserPersonasData,
} from "@/app/_services/personas.service";

type PersonasData = GetUserPersonasData | GetPublicPersonasData;

type PersonasProps = {
  className?: string;
  prefetchedData?: PersonasData;
};

const getKey = (pageIndex: number, previousPageData: any) => {
  // reached the end
  if (previousPageData && !previousPageData.data) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0)
    return `/api/library/personas?limit=${PERSONAS_PER_PAGE}`;

  return `/api/library/personas?cursor=${previousPageData.nextCursor}&limit=${PERSONAS_PER_PAGE}`;
};

export default function Personas(props: PersonasProps) {
  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite<{ data: PersonasData }>(getKey, {
      fallbackData: props.prefetchedData
        ? [{ data: props.prefetchedData }]
        : [],
    });

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
            )),
          )}
        </div>
      </WindowVirtualizer>
    </>
  );
}
