import { Spinner } from "@nextui-org/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Spinner />
    </div>
  );
}
