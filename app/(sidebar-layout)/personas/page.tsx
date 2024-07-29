import PersonasFilters from "@/app/_components/personas/personas-filters.client";

import { Suspense } from "react";
import Personas from "./_components/personas.client";

export default async function PublicPersonasPage() {
  return (
    <Suspense>
      <PersonasFilters />
      <hr className="my-2 border-none" />

      <Personas />
    </Suspense>
  );
}
