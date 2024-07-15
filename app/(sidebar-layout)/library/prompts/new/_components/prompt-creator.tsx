"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import PromptTextPromptForm from "./prompt-text-prompt-form";
import PromptCreatorForm from "./prompt-creator-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@nextui-org/skeleton";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

export default function PromptCreator() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded)
    return (
      <div className="space-y-4">
        <Skeleton className="rounded-lg">
          <div className="h-10 rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-10 rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    );

  if (!isSignedIn)
    return <div>You need to be logged in to generate a persona</div>;

  // These 2 looks awful, please when there's some time make it beautiful
  if (
    searchParams.get("mode") !== "creator" &&
    searchParams.get("mode") !== "text-prompt"
  ) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Card isBlurred className="bg-default-100/10">
          <CardHeader>
            <h2 className="text-foreground-500 text-2xl">Creator Mode</h2>
          </CardHeader>
          <CardBody>
            <p>
              Use our generator with lot of predefined sections and options, but
              also possibility to cusomtize every aspect of persona. Perfect for
              advanced and detailed personas creation.
            </p>
            <Button
              className="mt-4"
              variant="bordered"
              onPress={() => {
                const sp = new URLSearchParams(searchParams);
                sp.set("mode", "creator");
                replace(`?${sp.toString()}`);
              }}
            >
              Go to Creator Mode
            </Button>
          </CardBody>
        </Card>

        <Card isBlurred className="bg-default-100/10">
          <CardHeader>
            <h2 className="text-foreground-500 text-2xl">Text Prompt Mode</h2>
          </CardHeader>
          <CardBody>
            <p>
              Simply write a prompt and generate a persona. Either very quick
              way to get started or generate personas on the go.
            </p>
            <Button
              className="mt-4"
              variant="bordered"
              onPress={() => {
                const sp = new URLSearchParams(searchParams);
                sp.set("mode", "text-prompt");
                replace(`?${sp.toString()}`);
              }}
            >
              Go to Text Prompt Mode
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (searchParams.get("mode") === "creator") return <PromptCreatorForm />;

  return <PromptTextPromptForm />;
}
