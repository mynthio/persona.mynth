import React from "react";

import Sidebar from "./_components/sidebar";

type Props = {
  children: React.ReactNode;
};

export default async function SidebarLayout({ children }: Props) {
  return (
    <>
      <img
        src="/background.jpg"
        alt="Background"
        className="fixed top-0 left-0 -z-50 w-full h-full object-cover opacity-30 blur-md"
      />

      <Sidebar />

      <main className="lg:ml-96 pl-4 p-8">{children}</main>
    </>
  );
}
