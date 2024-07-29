"use client";

import { PERSONAS_PER_PAGE } from "@/app/_config/constants";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { WindowVirtualizer } from "virtua";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";

type ArrayData = Array<unknown>;

type Props<DataType extends ArrayData> = {
  className?: string;

  getKey: SWRInfiniteKeyLoader;

  children: (item: { persona: DataType[number] }) => React.ReactNode;

  itemSize?: number;

  prefetchedData?: DataType;
};

export default function PersonasInfiniteLoader<DataType extends ArrayData>(
  props: Props<DataType>
) {
  const { data, isLoading, size, setSize } = useSWRInfinite<{
    data: ArrayData;
  }>(props.getKey, {
    fallbackData: props.prefetchedData ? [{ data: props.prefetchedData }] : [],
  });

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (data && data[data.length - 1]?.data?.length < PERSONAS_PER_PAGE);

  return (
    <>
      <WindowVirtualizer itemSize={props.itemSize ?? 400}>
        <div className={cn(props.className)}>
          {data?.map((page) =>
            page.data?.map((persona) => props.children({ persona }))
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
