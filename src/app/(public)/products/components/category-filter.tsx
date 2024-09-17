'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useCallback } from 'react';
import { useCategories } from '@/hooks/use-category';

export default function CategoryFilter() {
  const { categories, isLoading } = useCategories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';

  const handleCategoryChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const categoryOptions = useMemo(() => (
    <>
      <SelectItem value="">Tất cả</SelectItem>
      {categories.map((category) => (
        <SelectItem key={category.id} value={category.id.toString()}>
          {category.name}
        </SelectItem>
      ))}
    </>
  ), [categories]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Category</h3>
      <select
        className="w-full p-2 border border-gray-300 rounded-md"
        onChange={(e) => handleCategoryChange(e.target.value)}
        value={currentCategory}
      >
        <option value="">Tất cả</option>
        {isLoading ? (
          <option value="" disabled>Loading...</option>
        ) : (
          categories.map((category) => (
            <option key={category.id} value={category.id.toString()}>
              {category.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

