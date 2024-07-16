import PersonasFilters from "@/app/_components/personas/personas-filters.client";
import Personas from "@/app/_components/personas/personas.client";
import { Suspense } from "react";

export default async function PublicPersonasPage() {
  return (
    <Suspense>
      <PersonasFilters />
      <hr className="my-2 border-none" />
      <Personas
        overwriteFilters={{
          published: true,
        }}
      />
    </Suspense>
  );
}
