"use client";

import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Filter, Trash } from "lucide-react";
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

    window.history.pushState(null, "", `?${sp.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <Button variant="light" startContent={<Filter size={12} />}>
            Filters
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          selectionMode="multiple"
          selectedKeys={searchParams.keys()}
          onAction={(key) => {
            toggleSearchParam("filter", String(key.toString()));
          }}
        >
          <DropdownItem key="bookmarked">Bookmarked</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
