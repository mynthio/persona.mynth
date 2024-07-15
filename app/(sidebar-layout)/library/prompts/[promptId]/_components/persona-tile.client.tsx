import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/react";

type Props = {
  persona: {
    id: string;
    name: string;
    age: string;
    summary: string;
    mainImageUrl?: string | null;
  };
};

export default function PersonaTile({ persona }: Props) {
  return (
    <Card key={persona.id}>
      <CardHeader>
        <Link href={`/library/personas/${persona.id}`} color="foreground">
          {persona.name} ({persona.age})
        </Link>
      </CardHeader>

      <CardBody>
        <p>{persona.summary}</p>
      </CardBody>

      {persona.mainImageUrl && (
        <Image
          className="w-full object-cover"
          src={persona.mainImageUrl}
          alt={persona.name}
        />
      )}
    </Card>
  );
}
