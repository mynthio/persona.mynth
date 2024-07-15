import Personas from "@/app/_components/personas/personas.client";

export default async function PublicPersonasPage() {
  return (
    <Personas
      overwriteFilters={{
        published: true,
      }}
    />
  );
}
