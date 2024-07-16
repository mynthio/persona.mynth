import { countPersonaGenerations } from "../_services/persona-generations.service";
import Personas from "../_components/personas/personas.client";
import { BackgroundBeams } from "../_components/ui/background-beams";
import { Suspense } from "react";

export default async function Home() {
  const personasGenerationsCount = await countPersonaGenerations();

  return (
    <>
      <div className="mt-20">
        <div className="text-center">
          <h3 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            {personasGenerationsCount}
          </h3>
          <p className="text-foreground-500 text-xl">
            AI generated personas by the community
          </p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold">Recently published personas</h2>

        <div className="w-full mt-8">
          <Suspense>
            <Personas
              overwriteFilters={{ published: true, limit: 3 }}
              showPagination={false}
            />
          </Suspense>
        </div>
      </div>
      <Suspense>
        <BackgroundBeams />
      </Suspense>
    </>
  );
}
