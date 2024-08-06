import NewPersonaForm from "./_components/new-persona-form.client";

export default async function NewPersona() {
  return (
    <div>
      <h1 className="text-3xl font-thin text-foreground-500 mb-10">
        New Persona
      </h1>
      <NewPersonaForm />
    </div>
  );
}
