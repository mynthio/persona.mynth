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
  PowerOff,
  Sparkles,
  Terminal,
  Users,
  X,
} from "lucide-react";
import { dark } from "@clerk/themes";

import { SignInButton, useClerk, UserButton, useUser } from "@clerk/nextjs";

import { Image } from "@nextui-org/image";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, ButtonGroup } from "@nextui-org/button";
import useSWR from "swr";
import { User } from "@nextui-org/user";

export default function Sidebar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openUserProfile, signOut, openSignIn } = useClerk();
  const { push } = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = React.useState(false);

  const { data, isLoading } = useSWR(
    isLoaded && isSignedIn && user ? "/api/tokens" : null
  );

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
        className={`fixed top-0 pr-8 left-0 z-40 w-80 h-screen transition-transform lg:translate-x-0 ${
          isOpen ? "" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <Card
          className="h-full shadow-none m-0 rounded-none border-0 border-r border-foreground-500/10 lg:backdrop-blur-sm dark:bg-background-900/90 lg:dark:bg-default-100/30"
          isBlurred
        >
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
              selectedKeys={pathname}
              aria-label="Actions"
              onAction={(key) => push(key as string)}
              itemClasses={{
                base: "data-[hover=true]:bg-default-100/30 py-3 rounded-xl",
                title: "text-[1.02rem] text-foreground-600/90",
              }}
            >
              <ListboxSection>
                <ListboxItem
                  key="/library/prompts/new"
                  className="data-[hover=true]:bg-purple-900/20"
                  startContent={
                    <Sparkles
                      size={24}
                      strokeWidth={1}
                      className="mr-1 text-purple-500"
                    />
                  }
                >
                  New Persona
                </ListboxItem>
              </ListboxSection>

              <ListboxSection title="Public">
                <ListboxItem
                  key="/personas"
                  startContent={
                    <Users size={24} strokeWidth={1} className="mr-1" />
                  }
                >
                  Personas
                </ListboxItem>
              </ListboxSection>

              <ListboxSection title={user?.username || "Library"}>
                <ListboxItem
                  key="/library/personas"
                  startContent={
                    <Users size={24} strokeWidth={1} className="mr-1" />
                  }
                >
                  Personas
                </ListboxItem>
                <ListboxItem
                  key="/library/prompts"
                  startContent={
                    <Terminal size={24} strokeWidth={1} className="mr-1" />
                  }
                >
                  Prompts
                </ListboxItem>

                <ListboxItem
                  key="/tokens"
                  startContent={
                    <Coins size={24} strokeWidth={1} className="mr-1" />
                  }
                >
                  {!isLoading && data?.remainingTokens
                    ? `${data.remainingTokens} tokens`
                    : ``}
                </ListboxItem>
              </ListboxSection>
            </Listbox>
          </CardBody>

          <CardFooter>
            {isLoaded && isSignedIn && user && (
              <ButtonGroup variant="light" size="lg" fullWidth>
                <Button
                  onPress={() => openUserProfile()}
                  className="justify-start p-0 pl-2"
                >
                  <User
                    name={user.username}
                    avatarProps={{
                      size: "sm",
                      className: "rounded-md",
                      src: user.imageUrl,
                    }}
                  />
                </Button>
                <Button isIconOnly onPress={() => signOut()}>
                  <PowerOff size={14} />
                </Button>
              </ButtonGroup>
            )}

            {isLoaded && !isSignedIn && (
              <Button
                className="w-full"
                variant="flat"
                size="lg"
                onPress={() => openSignIn()}
              >
                Sign in
              </Button>
            )}
          </CardFooter>
        </Card>
      </aside>
    </>
  );
}
