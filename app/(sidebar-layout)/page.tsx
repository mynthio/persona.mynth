import { countPersonaGenerations } from "../_services/persona-generations.service";
import { getPersonas, getPublicPersonas } from "../_services/personas.service";
import { auth } from "@clerk/nextjs/server";
import PublicPersonaCard from "../_components/personas/public-persona-card.client";
import { Suspense } from "react";
import { BackgroundBeams } from "../_components/ui/background-beams";
import {
  PersonaCard,
  PersonaCardBody,
  PersonaCardFooter,
  PersonaCardHeader,
  PersonaCardTitle,
} from "../_components/personas/persona-card.client";
import { PersonaCardBackgroundImage } from "../_components/personas/persona-card.client";
import {
  PersonaBookmarkButton,
  PersonaCreatorButton,
  PersonaLikeButton,
} from "../_components/personas/persona-buttons.client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";

export const revalidate = 1800; // 30 minutes

export default async function Home() {
  const { userId } = auth();

  const [personasGenerationsCount, recentPersonas] = await Promise.all([
    countPersonaGenerations(),
    getPublicPersonas({
      userId: userId ?? undefined,
      limit: 6,
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
        <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentPersonas.map((persona) => (
            <PersonaCard key={persona.id}>
              <PersonaCardHeader
                chips={[
                  {
                    label: "AI",
                  },
                ]}
              />

              {persona.mainImageUrl && (
                <PersonaCardBackgroundImage
                  alt={`Persona ${persona.name} main image`}
                  imageSrc={persona.mainImageUrl}
                />
              )}

              <PersonaCardBody>
                <PersonaCardTitle
                  href={`/personas/${persona.id}`}
                  title={persona.name}
                  subtitle={persona.summary}
                />
              </PersonaCardBody>

              <PersonaCardFooter>
                <PersonaCreatorButton username={persona.creator.username} />
                <div>
                  <PersonaLikeButton
                    personaId={persona.id}
                    likes={persona.likesCount}
                    liked={persona.liked}
                  />
                  <PersonaBookmarkButton
                    personaId={persona.id}
                    bookmarked={persona.bookmarked}
                  />
                </div>
              </PersonaCardFooter>
            </PersonaCard>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            as={Link}
            href="/personas"
            color="secondary"
            variant="shadow"
            endContent={<ArrowRight size={16} />}
          >
            Discover public personas
          </Button>
        </div>
      </div>
      <Suspense>
        <BackgroundBeams />
      </Suspense>
    </>
  );
}
