import { CharmsTable } from "./charms-table";
import { CreateCharmButton } from "./create-charm-button";
import { getCharmsUseCase } from "@/use-cases/charms";

export default async function CharmsPage() {
  const charms = await getCharmsUseCase();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-700">Charms</h1>
        <CreateCharmButton />
      </div>
      <CharmsTable/>
    </div>
  );
}