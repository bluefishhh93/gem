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

  const isOnSale = product.salePrice < product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(1, product);
  };

  return (
    <div
      key={product.id}
      className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <Image
            src={product.imgProducts[0]?.imageUrl || '/default-product.png'}
            alt={product.name}
            width={600}
            height={600}
            className="h-48 w-full object-cover object-center transition-all group-hover:scale-105"
          />
          {isOnSale && (
            <div className="absolute top-0 left-0 bg-secondary-500 text-white px-2 py-1 text-xs font-bold">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 bg-background dark:bg-gray-900">
        <h3 className="text-xl font-bold dark:text-white truncate">{product.name}</h3>
        <div className="h-12 mt-2">
          <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
            onClick={handleClick}
          >
            Thêm vào giỏ hàng
          </Button>
          <div className="text-right">         
            <span className="block text-lg font-semibold text-primary dark:text-primary">
              {vietnamCurrency(product.salePrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}