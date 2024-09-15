import { ProductsTable } from "./products-table";
import { CreateProductButton } from "./create-product-button";
import { Breadcrumb } from "@/components/Breadcrumb";


export default async function Page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-2xl font-bold text-secondary-700"></h1> */}
        <Breadcrumb items={[{ label: "Dashboard", link: "/admin" }, { label: "Products" }]} />
        <CreateProductButton />
      </div>
      <ProductsTable />
    </div>
  );
}