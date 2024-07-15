import { Suspense } from "react";
import Prompts from "./_components/prompts.client";

export default async function LibraryPromptsPage() {
  return (
    <Suspense>
      <Prompts />
    </Suspense>
  );
}
