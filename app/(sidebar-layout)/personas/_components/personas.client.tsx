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
  PersonaLikeButton,
} from "@/app/_components/personas/persona-buttons.client";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { PERSONAS_PER_PAGE } from "@/app/_config/constants";

dayjs.extend(relativeTime);

const getKey =
  (searchParams: URLSearchParams) =>
  (pageIndex: number, previousPageData: any) => {
    // reached the end
    if (previousPageData && !previousPageData.data) return null;

    // first page, we don't have `previousPageData`
    if (pageIndex === 0)
      return `/api/personas?limit=${PERSONAS_PER_PAGE}&filter=${searchParams.get(
        "filter"
      )}`;

    return `/api/personas?cursor=${
      previousPageData.nextCursor
    }&limit=${PERSONAS_PER_PAGE}&filter=${searchParams.get("filter")}`;
  };

type Props = {
  initialData?: any;
};

export default function Personas({ initialData }: Props) {
  const { user } = useUser();

  const searchParams = useSearchParams();

  return (
    <PersonasInfiniteLoader<GetUserPersonasData>
      getKey={getKey(searchParams)}
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
                label: dayjs(persona.publishedAt).fromNow(),
              },
            ]}
          />

          <PersonaCardBody>
            <PersonaCardTitle
              href={`/personas/${persona.id}`}
              title={persona.name}
              subtitle={persona.summary}
            />
          </PersonaCardBody>

          <PersonaCardFooter>
            <div>
              {user?.username && (
                <PersonaCreatorButton username={user.username} />
              )}
            </div>

            <div>
              <PersonaLikeButton
                className="ml-auto"
                personaId={persona.id}
                likes={persona.likesCount}
                liked={persona.liked}
              />

              <PersonaBookmarkButton
                className="ml-auto"
                personaId={persona.id}
                bookmarked={persona.bookmarked}
              />
            </div>
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
