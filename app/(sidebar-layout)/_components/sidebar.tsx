"use client";

import React from "react";

import {
  BookCopy,
  CircleUserRound,
  Package,
  PlusIcon,
  Sparkles,
  User,
} from "lucide-react";
import { dark } from "@clerk/themes";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { Image } from "@nextui-org/image";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Sidebar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { push } = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed p-8 pr-4 top-0 left-0 z-40 w-96 h-screen transition-transform sm:translate-x-0 ${
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
                  key="/personas/generate"
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

              <ListboxSection>
                <ListboxItem
                  key="/personas"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={
                    <CircleUserRound size={16} className="flex-shrink-0" />
                  }
                >
                  Personas
                </ListboxItem>

                <ListboxItem
                  key="/models"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={<Package size={16} className="flex-shrink-0" />}
                >
                  Models
                </ListboxItem>

                <ListboxItem
                  key="/library"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={
                    <BookCopy size={16} className="flex-shrink-0" />
                  }
                >
                  Library
                </ListboxItem>

                <ListboxItem
                  key="/profile"
                  className="text-foreground-500 py-2"
                  classNames={{
                    title: "text-[1.05rem] font-light",
                  }}
                  startContent={<User size={16} className="flex-shrink-0" />}
                >
                  Profile
                </ListboxItem>
              </ListboxSection>
            </Listbox>
          </CardBody>

          <CardFooter>
            {isLoaded &&
              (isSignedIn ? (
                <UserButton
                  showName
                  appearance={{
                    baseTheme: dark,
                  }}
                />
              ) : (
                <SignInButton />
              ))}
          </CardFooter>
        </Card>
      </aside>
    </>
  );
}
