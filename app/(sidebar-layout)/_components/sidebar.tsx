"use client";

import React from "react";

import {
  Book,
  BookCopy,
  CircleUserRound,
  Coins,
  Globe,
  Menu,
  Package,
  PlusIcon,
  Sparkles,
  Terminal,
  User,
  X,
} from "lucide-react";
import { dark } from "@clerk/themes";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { Image } from "@nextui-org/image";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import useSWR from "swr";

export default function Sidebar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { push } = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isLoading } = useSWR(isSignedIn ? "/api/tokens" : null);

  return (
    <>
      <Button
        isIconOnly
        onClick={() => setIsOpen(!isOpen)}
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex z-50 items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </Button>

      <aside
        id="default-sidebar"
        className={`fixed p-8 pr-4 top-0 left-0 z-40 w-96 h-screen transition-transform lg:translate-x-0 ${
          isOpen ? "" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <Card className="h-full dark:bg-default-100/60" isBlurred>
          <CardHeader>
            <Link href="/">
              <Image
                width={50}
                height={50}
                src="/persona-logo.png"
                alt="Persona Logo"
              />
            </Link>
          </CardHeader>

          <CardBody>
            <Listbox
              aria-label="Actions"
              onAction={(key) => push(key as string)}
            >
              <ListboxSection showDivider>
                <ListboxItem
                  key="/library/prompts/new"
                  color="success"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={
                    <Sparkles size={16} className="flex-shrink-0" />
                  }
                >
                  Generate Persona
                </ListboxItem>
              </ListboxSection>

              <ListboxSection title="Explore Public Creations" showDivider>
                <ListboxItem
                  key="/personas"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={<Globe size={16} className="flex-shrink-0" />}
                >
                  Personas
                </ListboxItem>
              </ListboxSection>

              <ListboxSection title={user?.username || ""}>
                <ListboxItem
                  key="/library"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={
                    <CircleUserRound size={16} className="flex-shrink-0" />
                  }
                >
                  Library
                </ListboxItem>

                <ListboxItem
                  key="/tokens"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={<Coins size={16} className="flex-shrink-0" />}
                >
                  {!isLoading && data
                    ? `${data.remainingTokens}/${data.dailyTokens} tokens`
                    : ``}
                </ListboxItem>
              </ListboxSection>
            </Listbox>
          </CardBody>

          <CardFooter className="flex-col">
            <div className="w-full">
              {isLoaded &&
                (isSignedIn ? (
                  <UserButton
                    showName
                    appearance={{
                      baseTheme: dark,
                      elements: {
                        userButtonOuterIdentifier: {
                          color: "hsl(var(--nextui-foreground-500)))",
                        },
                        rootBox: {
                          width: "100%",
                          marginBottom: "1.5rem",
                        },
                        button: {
                          width: "100%",
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="mb-2">
                    <SignInButton>
                      <Button
                        variant="bordered"
                        className="w-full text-foreground-600"
                      >
                        Sign in
                      </Button>
                    </SignInButton>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="bordered"
                as={Link}
                href="https://discord.gg/By5AnDQDTQ"
                target="_blank"
              >
                <img src="/discord-mark-blue.svg" alt="Discord" width={20} />
              </Button>
              <Button
                variant="bordered"
                as={Link}
                href="https://github.com/mynthio/persona.mynth"
                target="_blank"
              >
                <img src="/github-mark-white.svg" alt="Discord" width={20} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </aside>
    </>
  );
}
