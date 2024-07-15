"use client";

import { GetPersonaPromptsReturn } from "@/app/_services/persona-prompts.service";
import { CreatorPrompt, TextPrompt } from "@/schemas/create-prompt.schema";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/react";

type Props = {
  prompt: GetPersonaPromptsReturn[number];
};

export default function PromptCard({ prompt }: Props) {
  const promptInput = prompt.input as CreatorPrompt | TextPrompt;

  const preview =
    "textPrompt" in promptInput
      ? promptInput.textPrompt
      : `${promptInput.personaName} (${promptInput.age})`;

  const personasCount = prompt._count.personaGenerations;

  return (
    <Card className="dark:bg-default-100/60" isBlurred>
      <CardHeader>
        <Link
          href={`/library/prompts/${prompt.id}`}
          className="text-large font-medium text-foreground-600"
        >
          {prompt.name} ({personasCount} personas)
        </Link>
      </CardHeader>

      <CardBody>
        <p>{preview.slice(0, 100)}</p>
      </CardBody>
    </Card>
  );
}
