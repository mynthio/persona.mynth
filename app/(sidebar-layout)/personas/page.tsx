import PersonasFilters from "@/app/_components/personas/personas-filters.client";

import { Suspense } from "react";
import Personas from "./_components/personas";

export default async function PublicPersonasPage() {
  return (
    <Suspense>
      <PersonasFilters />
      <hr className="my-2 border-none" />
      {/* <Personas
        overwriteFilters={{
          published: true,
        }}
      /> */}
      <Personas className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
    </Suspense>
  );
}
