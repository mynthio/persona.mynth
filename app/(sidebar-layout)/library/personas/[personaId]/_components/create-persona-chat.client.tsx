import { createPersonaChatAction } from "@/app/_actions/create-persona-chat.action";
import {
  CreatePersonaChatInput,
  CreatePersonaChatSchema,
} from "@/schemas/create-persona-chat";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Props = {
  personaId: string;
};

export default function CreatePersonaChat({ personaId }: Props) {
  const { push } = useRouter();

  const { handleSubmit } = useForm<CreatePersonaChatInput>({
    resolver: superstructResolver(CreatePersonaChatSchema),
    defaultValues: {
      personaId,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const chat = await createPersonaChatAction(data);

        push(`/library/chats/${chat.id}`);
      })}
    >
      <Button type="submit">Create chat</Button>
    </form>
  );
}
