"use server";

import { prisma } from "@/prisma/client";
import {
  DeleteImageInput,
  DeleteImageSchema,
} from "@/schemas/delete-image.schema";
import { auth } from "@clerk/nextjs/server";
import { assert } from "superstruct";

export async function deleteImageAction(data: DeleteImageInput) {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  assert(data, DeleteImageSchema);

  const image = await prisma.image.findUnique({
    where: {
      id: data.imageId,
      creatorId: userId,
    },
  });

  if (!image) throw new Error("Image not found");

  await prisma.image.delete({
    where: {
      id: data.imageId,
    },
  });
}
