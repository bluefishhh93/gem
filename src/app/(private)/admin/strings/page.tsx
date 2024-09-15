import { StringsTable } from "./strings-table";
import { CreateStringButton } from "./create-string-button";
import { getStringsUseCase } from "@/use-cases/strings";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function StringsPage() {
  // const strings = await getStringsUseCase();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Breadcrumb items={[{ label: "Dashboard", link: "/admin" }, { label: "Strings" }]} />
        <CreateStringButton />
      </div>
      <StringsTable/>
    </div>
  );
}