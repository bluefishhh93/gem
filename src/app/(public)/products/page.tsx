import ProductList from './components/product-list';
import SearchBar from './components/search-bar';
import { getShopProductsUseCase } from '@/use-cases/products';
import { getCategoriesUseCase } from '@/use-cases/categories';
import Pagination from './components/pagination';
import CategoryFilter from './components/category-filter';
import PriceFilter from './components/price-filter';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className="relative mb-8">
        <Banner />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/5">
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

const Banner = () => {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero-img.jpg"
        alt="Zodiac Bracelet Body Products"
        width={1920}
        height={1080}
        className="h-full w-full object-cover object-center"
      />

      {/* Lighter Background Overlay with Blur for Light and Dark Mode */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md dark:bg-black/50" />

      {/* Banner Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-secondary-100 dark:text-white drop-shadow-md">
          Khám Phá Vẻ Đẹp Tâm Linh với Vòng Tay Cung Hoàng Đạo
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl text-white drop-shadow-md">
          Mang trên tay biểu tượng của các chòm sao, tôn vinh sự độc đáo và
          sức mạnh nội tâm của bạn.
        </p>
        <Link
          href="#"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-primary/90 dark:text-primary-foreground"
          prefetch={false}
        >
          Mua ngay
        </Link>
      </div>
    </section>
  );
};