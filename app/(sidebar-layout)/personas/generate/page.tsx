import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import GeneratePersonaForm from "./_components/generate-persona-form.client";

export default async function GeneratePersonaPage() {
  return (
    <Card isBlurred className="dark:bg-default-100/60 px-10">
      <CardHeader className="px-8 mt-8 justify-between items-end">
        {/* TODO use client */}
        <div className="max-w-xl">
          <strong className="text-foreground-600">Generate Persona</strong>
          <p className="text-small text-foreground-500 mt-2">
            Fill the fields or leave them empty for a surprise. After that, you
            can generate peronas in batch and later modify them and publish. By
            default generated personas are private. After generating a persona
            there will be more options to customize it and generate additional
            content like example messages etc.
          </p>
        </div>

        <div className="text-right">
          <p>
            <i className="text-small text-foreground-500 px-2">
              Empty fields will be auto generated
            </i>
          </p>
          <p>
            <i className="text-small text-foreground-500 px-2">
              NSFW personas are currently not supported
            </i>
          </p>
        </div>
      </CardHeader>

      <CardBody>
        <div className="mt-8 pb-10">
          <GeneratePersonaForm />
        </div>
      </CardBody>
    </Card>
  );
}
