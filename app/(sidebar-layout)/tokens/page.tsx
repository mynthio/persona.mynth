import { Card, CardBody } from "@nextui-org/card";

export default async function TokensPage() {
  return (
    <Card>
      <CardBody className="px-8 py-4">
        <p className="text-center text-balance">
          We need to limit the usage of personas generations. Otherwise we would
          run out of money 😁
        </p>
        <p className="text-center text-balance mt-4">
          You can find number of tokens left in the sidebar.
          <br />
          Tokens are restored every day.
          <br />
          Persona generation costs one token.
        </p>
      </CardBody>
    </Card>
  );
}
