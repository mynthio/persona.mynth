"use client";

import { useImageGenerations } from "@/app/_stores/image-generations.store";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import useSWR from "swr";

type Props = {
  personaId: string;
};

function ImageGeneration(props: { personaId: string; eventId: string }) {
  const imageGenerations = useImageGenerations();
  const { data } = useSWR(
    `/api/personas/${props.personaId}/image-generation/${props.eventId}`,
    {
      refreshInterval: 1000 * 5,
    }
  );

  React.useEffect(() => {
    if (data?.status === "done") {
      imageGenerations.updateImageGeneration(props.eventId, {
        status: "done",
        imageUrl: data.imageUrl,
        id: data.id,
      });
    }
  }, [data, props.eventId, imageGenerations]);

  return <Skeleton className="rounded-xl h-64" />;
}

export default function PendingImages({ personaId }: Props) {
  const params = useParams<{
    personaId: string;
  }>();
  const imageGenerations = useImageGenerations();

  return imageGenerations.data
    .filter((imageGeneration) => imageGeneration.personaId === params.personaId)
    .map((imageGeneration) =>
      imageGeneration.status === "done" ? (
        <Link
          key={imageGeneration.id}
          href={`/library/personas/${personaId}/gallery?image=${imageGeneration.id}?image=${imageGeneration.id}`}
        >
          <Image
            key={imageGeneration.id}
            src={imageGeneration.imageUrl}
            alt={imageGeneration.imageUrl}
          />
        </Link>
      ) : (
        <ImageGeneration
          key={imageGeneration.id}
          personaId={personaId}
          eventId={imageGeneration.eventId}
        />
      )
    );
}
