"use client";

import { useRouter } from "next/navigation";

import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();

  return (
    <ClerkProvider>
      <NextUIProvider navigate={push}>{children}</NextUIProvider>
    </ClerkProvider>
  );
}
