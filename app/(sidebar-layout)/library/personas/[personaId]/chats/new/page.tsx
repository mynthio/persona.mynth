import CreateChatForm from "./_components/create-chat-form.client";

type Props = {
  params: {
    personaId: string;
  };
};

export default async function NewChatPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-light text-foreground-500">New chat</h1>

      <div className="max-w-xl mt-10">
        <p className="text-small text-foreground-500 mb-4">
          Create a new chat, fill options or leave empty for simple chat. When
          referring to personas, {"{{persona}}"}, and while referring to your
          character use {"{{user}}"}. Try our templates to better understand how
          it works.
        </p>
        <CreateChatForm personaId={params.personaId} />
      </div>
    </div>
  );
}
