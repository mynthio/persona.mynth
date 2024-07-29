import { Spinner } from "@nextui-org/spinner";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Spinner color="secondary" />
    </div>
  );
}
