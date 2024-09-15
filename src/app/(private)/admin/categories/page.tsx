import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoriesTable } from "./categories-table";
import { CreateCategoryButton } from "./create-category-button";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb items={[{ label: "Dashboard", link: "/admin" }, { label: "Categories" }]} />
        <CreateCategoryButton />
      </div>
      <CategoriesTable />
    </div>
  );
}