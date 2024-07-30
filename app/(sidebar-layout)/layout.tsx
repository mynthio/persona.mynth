import React from "react";
import { Toaster } from "sonner";

import Sidebar from "./_components/sidebar";
import { Button } from "@nextui-org/button";
import { Image, Link } from "@nextui-org/react";

type Props = {
  children: React.ReactNode;
};

export default async function SidebarLayout({ children }: Props) {
  return (
    <>
      <div className="bg-gradient-to-tl from-purple-950/50 to-black fixed top-0 left-0 -z-50 w-full h-full" />

      <Toaster />
      <Sidebar />

      <main className="lg:ml-80 pl-4 p-8">{children}</main>

      <footer className="lg:pl-80 pl-4 p-8 w-full flex-col mt-20 justify-center">
        <div className="flex items-center justify-center">
          <Image
            width={50}
            height={50}
            src="/persona-logo.png"
            alt="Persona Logo"
          />
        </div>

        <div className="flex gap-4 items-center w-full justify-center mt-10">
          <Button
            as={Link}
            href="https://discord.gg/BcEFDbEHPg"
            target="_blank"
            variant="solid"
            className="bg-foreground-500/10"
          >
            <img src="/discord-mark-blue.svg" alt="Discord" className="h-4" />
          </Button>
          <Button
            as={Link}
            target="_blank"
            variant="solid"
            className="bg-foreground-500/10"
            href="https://github.com/mynthio/persona.mynth"
          >
            <img src="/github-mark-white.svg" alt="Github" className="h-4" />
          </Button>
          <Button
            as={Link}
            target="_blank"
            variant="solid"
            className="bg-foreground-500/10"
            href="https://x.com/mynthio"
          >
            <img src="/x-logo.svg" alt="Github" className="h-4" />
          </Button>
        </div>

        <div className="mt-6 flex justify-center">
          <p className="text-small text-foreground-500">
            by{" "}
            <Link
              href="https://x.com/mynthio"
              target="_blank"
              className="text-foreground-500 text-small"
            >
              mynth
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
