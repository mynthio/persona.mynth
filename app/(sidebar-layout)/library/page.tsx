import { auth } from "@clerk/nextjs/server";
import Library from "./_components/library.client";
import { prisma } from "@/prisma/client";
import dynamic from "next/dynamic";

import { SWRConfig } from "swr";

const Personas = dynamic(() => import("./_components/personas.client"), {
  ssr: false,
});

export default async function LibraryPage() {
  const { userId } = auth();

  if (!userId) return null;

  const initialPersonas = await prisma.persona.findMany({
    where: {
      creatorId: userId,
    },
    take: 20,
  });

  return (
    // <SWRConfig
    //   value={{
    //     fallback: {
    //       "/api/library/personas?limit=20": initialPersonas,
    //     },
    //   }}
    // >
    <Personas initialData={initialPersonas} />
    // </SWRConfig>
  );
}
