"use client";

import { useAuth } from "@clerk/nextjs";
import { Textarea } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/skeleton";

export default function PromptTextPromptForm() {
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

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-full">
        <h3 className="text-large text-foreground-500 p-3">Text prompt</h3>
      </div>

      <div className="col-span-full">
        <Textarea
          fullWidth
          placeholder="a woman, around 20 years old, student, long hairs, playing tennis"
          description="Write character information that will be used to generate persona"
        />
      </div>
    </form>
  );
}
