import Personas from "@/app/_components/personas/personas.client";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Card, CardBody, CardHeader, Image, Link } from "@nextui-org/react";

export default async function UserPersonasPage() {
  const { userId } = auth();
  if (!userId) return <div>You need to be signed in to see this page</div>; // TODO: Add some cool component for login on such pages

  return (
    <Personas
      overwriteFilters={{ creatorId: userId }}
      personaPath="/library/personas"
    />
  );
}
