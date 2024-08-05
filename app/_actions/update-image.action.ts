"use server";

import { prisma } from "@/prisma/client";
import {
  UpdateImageData,
  UpdateImageSchema,
} from "@/schemas/update-image.schema";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export async function updateImageAction(data: UpdateImageData) {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, UpdateImageSchema);

  const image = await prisma.image.update({
    where: {
      id: data.imageId,
    },
    data: {
      public: data.public,
    },
  });

  return image;
}
