"use client";

import { Earth, Lock } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PersonasInfiniteLoader from "@/app/_components/personas/personas-infinite-loader";
import {
  PersonaCard,
  PersonaCardBackgroundImage,
  PersonaCardBody,
  PersonaCardFooter,
  PersonaCardHeader,
  PersonaCardTitle,
} from "@/app/_components/personas/persona-card.client";
import { GetUserPersonasData } from "@/app/_services/personas.service";
import {
  PersonaBookmarkButton,
  PersonaCreatorButton,
} from "@/app/_components/personas/persona-buttons.client";
import { useUser } from "@clerk/nextjs";
import { PERSONAS_PER_PAGE } from "@/app/_config/constants";

dayjs.extend(relativeTime);

const getKey = (pageIndex: number, previousPageData: any) => {
  // reached the end
  if (previousPageData && !previousPageData.data) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0)
    return `/api/library/personas?limit=${PERSONAS_PER_PAGE}`;

  return `/api/library/personas?cursor=${previousPageData.nextCursor}&limit=${PERSONAS_PER_PAGE}`;
};

type Props = {
  initialData?: any;
};

export default function Personas({ initialData }: Props) {
  const { user } = useUser();

  return (
    <PersonasInfiniteLoader<GetUserPersonasData>
      getKey={getKey}
      itemSize={400}
      className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {({ persona }) => (
        <PersonaCard key={persona.id}>
          <PersonaCardHeader
            chips={[
              {
                icon: persona.published ? (
                  <Earth size={16} />
                ) : (
                  <Lock size={16} />
                ),
              },
              {
                label: dayjs(persona.createdAt).fromNow(),
              },
            ]}
          />

          <PersonaCardBody>
            <PersonaCardTitle
              href={`/library/personas/${persona.id}`}
              title={persona.name}
              subtitle={persona.summary}
            />
          </PersonaCardBody>

          <PersonaCardFooter>
            {user?.username && (
              <PersonaCreatorButton username={user.username} />
            )}

            <PersonaBookmarkButton
              className="ml-auto"
              personaId={persona.id}
              bookmarked={persona.bookmarked}
            />
          </PersonaCardFooter>

          {persona.mainImageUrl && (
            <PersonaCardBackgroundImage
              alt={`Persona ${persona.name} main image`}
              imageSrc={persona.mainImageUrl}
            />
          )}
        </PersonaCard>
      )}
    </PersonasInfiniteLoader>
  );
}
