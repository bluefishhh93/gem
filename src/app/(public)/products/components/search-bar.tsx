'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback } from 'react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/products?${params.toString()}`, { scroll: false });
    }, [search, searchParams, router]);

    return (
        <form onSubmit={handleSearch} className="mb-6">
            <div className="flex">
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nhập tên sản phẩm..."
                    className="flex-grow"
                />
                <Button type="submit" className="ml-2">
                    Tìm kiếm
                </Button>
            </div>
        </form>
    );
}