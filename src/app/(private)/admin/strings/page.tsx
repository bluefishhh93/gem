import { StringsTable } from "./strings-table";
import { CreateStringButton } from "./create-string-button";
import { getStringsUseCase } from "@/use-cases/strings";

export default async function StringsPage() {
  // const strings = await getStringsUseCase();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-700">Strings</h1>
        <CreateStringButton />
      </div>
      <StringsTable/>
    </div>
  );
}