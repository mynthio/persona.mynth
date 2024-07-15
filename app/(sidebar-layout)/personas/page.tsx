import Personas from "@/app/_components/personas/personas.client";
import { Suspense } from "react";

export default async function PublicPersonasPage() {
  return (
    <Suspense>
      <Personas
        overwriteFilters={{
          published: true,
        }}
      />
    </Suspense>
  );
}
