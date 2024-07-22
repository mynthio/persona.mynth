import React from "react";
import { Toaster } from "sonner";

import Sidebar from "./_components/sidebar";

type Props = {
  children: React.ReactNode;
};

export default async function SidebarLayout({ children }: Props) {
  return (
    <>
      <div className="bg-gradient-to-tl from-purple-950/50 to-black fixed top-0 left-0 -z-50 w-full h-full" />

      <Toaster />
      <Sidebar />

      <main className="lg:ml-96 pl-4 p-8">{children}</main>
    </>
  );
}
