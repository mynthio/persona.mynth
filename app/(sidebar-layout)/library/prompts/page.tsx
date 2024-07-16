import { Suspense } from "react";
import Prompts from "./_components/prompts.client";
import { auth } from "@clerk/nextjs/server";

export default async function LibraryPromptsPage() {
  const { userId } = await auth();

  if (!userId) return <div>You need to be signed in to see this page</div>; // TODO: Add some cool component for login on such pages

  return (
    <Suspense>
      <Prompts />
    </Suspense>
  );
}
