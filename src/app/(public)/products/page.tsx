import SearchBar from './components/search-bar';
import CategoryFilter from './components/category-filter';
import PriceFilter from './components/price-filter';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductList from './components/product-list';
import Cart from '@/components/cart/Cart';
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <Banner />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/5">
          <Suspense fallback={<FiltersSkeleton />}>
            <SearchBar />
            <CategoryFilter />
            <PriceFilter />
          </Suspense>
        </div>
        <div className="w-full md:w-3/4">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
      <Cart/ >
    </div>
  );
}

const FiltersSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
};

const Banner = () => {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden rounded-3xl">
      {/* Background Image */}
      <Image
        src="/hero-img.jpg"
        alt="Zodiac Bracelet Body Products"
        width={1920}
        height={1080}
        className="h-full w-full object-cover object-center"
      />

      {/* Lighter Background Overlay with Blur for Light and Dark Mode */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md dark:bg-black/50 rounded-3xl" />

      {/* Banner Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-secondary-100 dark:text-white drop-shadow-md">
          Khám Phá Vẻ Đẹp Tâm Linh với Vòng Tay Cung Hoàng Đạo
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl text-white drop-shadow-md">
          Mang trên tay biểu tượng của các chòm sao, tôn vinh sự độc đáo và
          sức mạnh nội tâm của riêng bạn.
        </p>
        <Link
          href="/custom"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:bg-secondary/90 dark:text-secondary-foreground dark:hover:bg-secondary/50"
          prefetch={false}
        >
          Thiết kế ngay
        </Link>
      </div>
    </section>
  );
};

const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-md dark:bg-gray-800"
        >
          <div className="absolute inset-0 z-10" />

          {/* Skeleton Image */}
          <Skeleton className="h-48 w-full object-cover object-center" />

          {/* Product Info Skeleton */}
          <div className="p-10 bg-background dark:bg-gray-900">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
          </div>
        </div>
      ))}
    </div>
  );
};


