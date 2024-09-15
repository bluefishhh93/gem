import { Breadcrumb } from "@/components/Breadcrumb";
import { CharmsTable } from "./charms-table";
import { CreateCharmButton } from "./create-charm-button";
import { getCharmsUseCase } from "@/use-cases/charms";

export default async function CharmsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb items={[{ label: "Dashboard", link: "/admin" }, { label: "Charms" }]} />
        <CreateCharmButton />
      </div>
      <CharmsTable/>
    </div>
  );
}