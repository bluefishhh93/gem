"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { vietnamCurrency } from '@/util/util';
import { useAddToCart } from '@/hooks/use-add-to-cart';

interface Product {
  id: number;
  name: string;
  description: string;
  currentQuantity: number;
  price: number;
  salePrice: number;
  isActivated: boolean;
  categoryId: number;
  imgProducts: {
    id: number;
    imageUrl: string;
    publicId: string;
    productId: number;
  }[];
}


export default function ProductListContent({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductItem({ product }: { product: Product }) {
  const { handleAddToCart, isAdding } = useAddToCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(1, product);
  };

  return (
    <div
      key={product.id}
      className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-md dark:bg-gray-800"
    >

      <span className="sr-only">View Product</span>

      <Link
        href={`/products/${product.id}`}

      >
        <Image
          src={product.imgProducts[0]?.imageUrl || '/default-product.png'}
          alt={product.name}
          width={600}
          height={600}
          className="h-48 w-full object-cover object-center transition-all group-hover:scale-105"
        />
      </Link>
      <div className="p-4 bg-background dark:bg-gray-900">
        <h3 className="text-xl font-bold dark:text-white">{product.name}</h3>
        <div className="h-14">
          <p className="text-sm text-muted-foreground dark:text-gray-300">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button size="sm" className="dark:bg-primary dark:text-primary-foreground"
            onClick={handleClick}
          >
            Thêm vào giỏ hàng
          </Button>
          <span className="font-semibold dark:text-gray-100">
            {vietnamCurrency(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}