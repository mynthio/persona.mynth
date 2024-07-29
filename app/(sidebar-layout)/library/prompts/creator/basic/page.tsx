import { Card, CardBody, CardHeader } from "@nextui-org/card";

import { Suspense } from "react";

import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
import { Text } from "lucide-react";
import PromptCreatorForm from "../../new/_components/prompt-creator-form";

export default async function NewPromptPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-2">
          <h1 className="text-4xl font-thin text-foreground-500">
            Prompt Creator
          </h1>

          <Chip variant="shadow" color="danger" size="sm">
            Beta
          </Chip>
        </div>

        <Button
          variant="flat"
          as={Link}
          startContent={<Text size={12} />}
          href="/library/prompts/creator/text"
        >
          Switch to text prompt
        </Button>
      </div>
      <Suspense>
        <PromptCreatorForm />
      </Suspense>
    </div>
  );

  // return (
  //   <Card isBlurred className="dark:bg-default-100/60 px-10">
  //     <CardHeader className="mt-10">
  //       <div>
  //         <strong className="text-foreground-600">
  //           Create prompt for personas generation
  //         </strong>
  //         <p className="text-small text-foreground-500 mt-2">
  //           Fill the fields or leave them empty for a surprise. After that, you
  //           can generate peronas in batch and later modify them and publish. By
  //           default generated personas are private. After generating a persona
  //           there will be more options to customize it and generate additional
  //           content like example messages etc. Use generator for more advanced
  //           persona, or text prompt for simplicity and flexibility.
  //         </p>
  //         <p>
  //           <i className="text-small text-foreground-500">
  //             Empty fields will be auto generated
  //           </i>
  //         </p>
  //         <p>
  //           <i className="text-small text-foreground-500">
  //             NSFW personas are currently not supported
  //           </i>
  //         </p>
  //       </div>
  //     </CardHeader>

  //     <CardBody>
  //       <Suspense>
  //         <PromptCreator />
  //       </Suspense>
  //     </CardBody>
  //   </Card>
  // );
}
