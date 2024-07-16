"use client";

import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PersonasFilters() {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const toggleSearchParam = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams);

    if (sp.has(key)) {
      sp.delete(key);
    } else {
      sp.set(key, value);
    }

    push(`?${sp.toString()}`);
  };

  return (
    <Dropdown backdrop="blur" size="lg">
      <DropdownTrigger>
        <Button
          endContent={
            searchParams.has("bookmarked") ? (
              <Button
                isIconOnly
                size="sm"
                variant="faded"
                onClick={() => {
                  push(`?`);
                }}
              >
                <Trash size={12} />
              </Button>
            ) : null
          }
        >
          Filters
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        selectionMode="multiple"
        selectedKeys={searchParams.keys()}
        onAction={(key) => {
          console.log(key.valueOf());
          toggleSearchParam(String(key.toString()), "true");
        }}
      >
        <DropdownItem key="bookmarked">Bookmarked</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
