import { Card, CardBody, CardHeader } from "@nextui-org/card";
import PromptCreatorForm from "./_components/prompt-creator-form";
import { Tab, Tabs } from "@nextui-org/tabs";
import PromptTextPromptForm from "./_components/prompt-text-prompt-form";
import PromptCreator from "./_components/prompt-creator";

export default async function NewPromptPage() {
  return (
    <Card isBlurred className="dark:bg-default-100/60 px-10">
      <CardHeader className="mt-10">
        {/* TODO use client */}
        <div>
          <strong className="text-foreground-600">Generate Persona</strong>
          <p className="text-small text-foreground-500 mt-2">
            Fill the fields or leave them empty for a surprise. After that, you
            can generate peronas in batch and later modify them and publish. By
            default generated personas are private. After generating a persona
            there will be more options to customize it and generate additional
            content like example messages etc. Use generator for more advanced
            persona, or text prompt for simplicity and flexibility.
          </p>
          <p>
            <i className="text-small text-foreground-500">
              Empty fields will be auto generated
            </i>
          </p>
          <p>
            <i className="text-small text-foreground-500">
              NSFW personas are currently not supported
            </i>
          </p>
        </div>
      </CardHeader>

      <CardBody>
        <PromptCreator />
      </CardBody>
    </Card>
  );
}
