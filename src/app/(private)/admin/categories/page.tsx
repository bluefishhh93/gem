import { CategoriesTable } from "./categories-table";
import { CreateCategoryButton } from "./create-category-button";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-700">Categories</h1>
        <CreateCategoryButton />
      </div>
      <CategoriesTable />
    </div>
  );
}