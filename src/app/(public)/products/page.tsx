import ProductList from './components/product-list';
import SearchBar from './components/search-bar';
import { getShopProductsUseCase } from '@/use-cases/products';
import { getCategoriesUseCase } from '@/use-cases/categories';
import Pagination from './components/pagination';
import CategoryFilter from './components/category-filter';
import PriceFilter from './components/price-filter';
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;
  const search = searchParams.search as string | undefined;
  const category = searchParams.category ? Number(searchParams.category) : undefined;
  const minPrice = Number(searchParams.minPrice) || undefined;
  const maxPrice = Number(searchParams.maxPrice) || undefined;

  // const categories = await getCategoriesUseCase();
  const { products, totalProducts } = await getShopProductsUseCase({ page, pageSize, search, category, minPrice, maxPrice });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <SearchBar />
          <CategoryFilter />
          <PriceFilter />
        </div>
        <div className="w-full md:w-3/4">
          {products.length > 0 ? (
            <>
              <ProductList products={products} />
              <Pagination
                currentPage={page}
                totalPages={Math.max(1, Math.ceil(Number(totalProducts) / pageSize))}
              />
            </>
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}