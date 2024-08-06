"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import got from "got";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import "server-only";
import sharp from "sharp";

export const uploadPersonaImageAction = async (formData: FormData) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not found");

  const data = Object.fromEntries(formData.entries()) as any;
  console.log(data);
  if (!data.image) throw new Error("Image not found");

  // Optimize image
  const optimizedImageBuffer = await sharp(await data.image.arrayBuffer())
    .resize({
      width: 1024,
      height: 1024,
    })
    .webp({
      quality: 80,
    })
    .toBuffer();

  const uploadPath = `personas/${data.personaId}/${nanoid(12)}.webp`;

  await got.put(
    `https://ny.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${uploadPath}`,
    {
      headers: {
        AccessKey: process.env.BUNNY_CDN_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(optimizedImageBuffer),
    }
  );

  await prisma.image.create({
    data: {
      imageUrl: `https://${process.env.BUNNY_CDN_HOST}/${uploadPath}`,
      creator: {
        connect: {
          id: userId,
        },
      },
      persona: {
        connect: {
          id: data.personaId,
        },
      },
    },
  });

  revalidatePath(`/library/personas/${data.personaId}/gallery`);
};
