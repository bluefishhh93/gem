import {ProductsTable} from "./products-table";
import { CreateProductButton } from "./create-product-button";


export default function Page() {
    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-secondary-700">Products</h1>
          <CreateProductButton />
        </div>
        <ProductsTable />
      </div>
    );
}