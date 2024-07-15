"use client";

import { useRouter } from "next/navigation";

import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { SWRConfig } from "swr";
import { fetcher } from "./_utils/utils";

export function Providers({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();

  return (
    <ClerkProvider>
      <NextUIProvider navigate={push}>
        <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
      </NextUIProvider>
    </ClerkProvider>
  );
}
