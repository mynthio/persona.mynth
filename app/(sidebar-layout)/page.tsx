import { countPersonaGenerations } from "../_services/persona-generations.service";
import { getPersonas } from "../_services/personas.service";
import { auth } from "@clerk/nextjs/server";
import Personas from "../_components/personas/personas.client";
import PublicPersonaCard from "../_components/personas/public-persona-card.client";

export const revalidate = 1800; // 30 minutes

export default async function Home() {
  const { userId } = auth();

  const [personasGenerationsCount, recentPersonas] = await Promise.all([
    countPersonaGenerations(),
    getPersonas({
      page: 1,
      published: true,
      showNsfw: false,
      userId,
    }),
  ]);

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

        <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentPersonas.map((persona) => (
            <PublicPersonaCard
              showFooter={false}
              path="/personas"
              key={persona.id}
              persona={{
                ...persona,
                isLiked: !!persona.likes?.length,
                isBookmarked: !!persona.bookmarks?.length,
              }}
            />
          ))}
        </div>
      </div>
      <Suspense>
        <BackgroundBeams />
      </Suspense>
    </>
  );
}
