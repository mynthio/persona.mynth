import { logger } from "@/lib/logger";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

import { ImagePlus, Sparkles, Upload } from "lucide-react";
import GenerateImageButton from "./_components/generate-image-button.client";
import PendingImages from "./_components/pending-images.client";
import Link from "next/link";
import ImageModal from "./_components/image-modal.client";

type Props = {
  params: {
    personaId: string;
  };
};

export default async function LibraryPersonaGallery({ params }: Props) {
  const { userId } = auth();
  if (!userId) return null;

  const persona = await prisma.persona.findUnique({
    where: {
      id: params.personaId,
      creatorId: userId,
    },
    select: {
      id: true,
      images: {
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!persona) return null;

  const { images } = persona;

  return (
    <>
      <div>
        <GenerateImageButton
          personaId={params.personaId}
          startContent={<Sparkles size={12} />}
          variant="flat"
        >
          Generate
        </GenerateImageButton>
      </div>
      <div className="grid mt-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* The create button */}
        {/* <div className="p-4 text-foreground-500 bg-default-500/10 rounded-xl flex flex-col justify-end">
          <div className="flex items-center justify-center flex-1">
            <ImagePlus
              className="text-foreground-300/50"
              size={26}
              strokeWidth={1}
            />
          </div>

          <GenerateImageButton
            fullWidth
            personaId={params.personaId}
            startContent={<Sparkles size={12} />}
            variant="flat"
          >
            Generate
          </GenerateImageButton>

          <Button
            startContent={<Upload size={12} />}
            variant="light"
            className="mt-2"
          >
            Upload
          </Button>
        </div> */}

        <PendingImages personaId={params.personaId} />

        {images.map((image) => (
          <Link
            key={image.id}
            href={`/library/personas/${params.personaId}/gallery?image=${image.id}`}
          >
            <Image key={image.id} src={image.imageUrl} alt={image.imageUrl} />
          </Link>
        ))}
      </div>

      <ImageModal />
    </>
  );
}
