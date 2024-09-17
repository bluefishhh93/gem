import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { vietnamCurrency } from '@/util/util';

interface Product {
  id: number;
  name: string;
  description: string;
  currentQuantity: number;
  price: number;
  salePrice: number;
  isActivated: boolean | null;
  categoryId: number;
  imgProducts: {
    id: number;
    imageUrl: string | null;
    publicId: string | null;
    productId: number | null;
  }[];
}

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
        key={product.id}
        className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-md dark:bg-gray-800 "
      >
        <Link
          href={`/products/${product.id}`}
          className="absolute inset-0 z-10"
          prefetch={false}
        >
          <span className="sr-only">View Product</span>
        </Link>
        <Image
          src={product.imgProducts[0]?.imageUrl || '/default-product.png'}
          alt={product.name}
          width={600}
          height={600}
          className="h-48 w-full object-cover object-center transition-all group-hover:scale-105"
        />
        <div className="p-4 bg-background dark:bg-gray-900">
          <h3 className="text-xl font-bold dark:text-white">{product.name}</h3>
          <div className="h-14">
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              {product.description}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button size="sm" className="dark:bg-primary dark:text-primary-foreground">
              Thêm vào giỏ hàng
            </Button>
            <span className="font-semibold dark:text-gray-100">
              {vietnamCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}