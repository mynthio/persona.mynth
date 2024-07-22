"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { Clock, Globe, Heart, Lock, VenetianMask } from "lucide-react";

import useSWRInfinite from "swr/infinite";

import { experimental_VGrid as VGrid, WindowVirtualizer } from "virtua";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { Chip } from "@nextui-org/chip";

dayjs.extend(relativeTime);

const LIMIT = 20;

const getKey = (pageIndex: number, previousPageData: any) => {
  console.log({
    pageIndex,
    previousPageData,
  });
  // reached the end
  if (previousPageData && !previousPageData.data) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/api/library/personas?limit=${LIMIT}`;

  return `/api/library/personas?cursor=${previousPageData.nextCursor}&limit=${LIMIT}`;
};

type Props = {
  initialData?: any;
};

export default function Personas({ initialData }: Props) {
  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite(getKey, {
      fallbackData: [{ data: initialData }],
    });

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isRefreshing = isValidating && data && data.length === size;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < LIMIT);

  const isMore = data?.[0]?.length < LIMIT;

  return (
    <>
      <WindowVirtualizer
        itemSize={400}
        // onScrollEnd={() => {
        //   if (isLoading || isValidating) return;
        //   setSize(size + 1);
        // }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-8">
          {data?.map((page) =>
            page.data?.map((persona) => (
              <Card key={persona.id} className="h-[400px] overflow-hidden">
                <CardHeader className="absolute z-10 top-0 left-0 right-0 flex-col pb-6 !items-start rounded-none">
                  <div className="flex items-center gap-4 text-foreground-700 py-2 text-small">
                    {persona.personaGenerationId && (
                      <span variant="light">AI</span>
                    )}

                    <div>
                      {persona.published ? (
                        <Globe size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                    </div>

                    {persona.published && (
                      <div className="flex items-center gap-2">
                        {persona.likesCount}
                        <Heart size={14} />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {dayjs(persona.createdAt).fromNow()}
                      <Clock size={14} />
                    </div>
                  </div>
                </CardHeader>

                {/* <CardBody className="overflow-hidden p-0"> */}
                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 w-full h-full object-cover"
                  src={persona.mainImageUrl}
                />

                <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-purple-950/20 via-transparent to-black/90" />

                <CardFooter className="absolute bg-transparent bottom-0 m-0 left-0 right-0 md:p-6 w-auto rounded-t-xl z-10 flex-col h-32">
                  <Link
                    href={`/library/personas/${persona.id}`}
                    className="text-white font-medium text-2xl w-full overflow-hidden truncate whitespace-nowrap"
                  >
                    {persona.name}
                  </Link>

                  <p className="text-small text-white/60 overflow-hidden whitespace-break-spaces mt-3 line-clamp-2 w-full">
                    {persona.summary}
                  </p>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </WindowVirtualizer>

      <div className="flex justify-center mt-10">
        {!isReachingEnd ? (
          <Button
            isDisabled={!isLoadingMore && isReachingEnd}
            isLoading={isLoadingMore || isRefreshing}
            onClick={() => setSize(size + 1)}
          >
            {isLoadingMore || isRefreshing ? "Loading..." : "Load more"}
          </Button>
        ) : (
          <p className="italic text-small text-foreground-500">
            No more personas
          </p>
        )}
      </div>
    </>
  );
}
