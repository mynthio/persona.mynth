import { auth } from "@clerk/nextjs/server";
import Library from "./_components/library-navigation.client";
import { prisma } from "@/prisma/client";
import dynamic from "next/dynamic";

import { SWRConfig } from "swr";
import { BackgroundBeams } from "@/app/_components/ui/background-beams";
import PublicPersonaCard from "@/app/_components/personas/public-persona-card.client";

const Personas = dynamic(() => import("./_components/personas.client"), {
  ssr: false,
});

export default async function LibraryPage() {
  const { userId } = auth();

  if (!userId) return null;

  const recentPersonas = await prisma.persona.findMany({
    where: {
      creatorId: userId,
    },
    take: 3,
  });

  return (
    // <SWRConfig
    //   value={{
    //     fallback: {
    //       "/api/library/personas?limit=20": initialPersonas,
    //     },
    //   }}
    // >
    // <Personas initialData={initialPersonas} />
    <>
      <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-500 mt-10">
        Hello
      </h1>

      <h2 className="text-3xl font-thin text-foreground-500 text-left mt-20">
        Your latest personas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {recentPersonas.map((persona) => (
          <PublicPersonaCard
            showFooter={false}
            path="/library/personas"
            key={persona.id}
            persona={{
              ...persona,
            }}
            showFooter={false}
          />
        ))}
      </div>

      <BackgroundBeams />
    </>
    // </SWRConfig>
  );
}
