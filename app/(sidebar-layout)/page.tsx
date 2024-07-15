import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Bookmark, Heart } from "lucide-react";
import { countPersonaGenerations } from "../_services/persona-generations.service";
import { getPersonas } from "../_services/personas.service";
import PublicPersonaCard from "../_components/personas/public-persona-card.client";
import { auth } from "@clerk/nextjs/server";
import Personas from "../_components/personas/personas.client";

export default async function Home() {
  const { userId } = auth();
  const personasGenerationsCount = await countPersonaGenerations();
  const recentlyPublishedPersonas = await getPersonas({
    page: 1,
    published: true,
    showNsfw: false,
    limit: 3,
    userId,
  });

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
          <Personas
            overwriteFilters={{ published: true, limit: 3 }}
            showPagination={false}
          />
        </div>
      </div>
    </>
  );
}
