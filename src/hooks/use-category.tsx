"use client";
import { useState, useEffect } from 'react';

export function useCategories() {
    const [categories, setCategories] = useState<{
        id: number;
        name: string;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories',{
                    next: {
                        revalidate: 60 * 60,
                    }
                });
                const data = await response.json(); 
                setCategories(data);
                setIsLoading(false);
            } catch (error: any) {
                setError(error);
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, []);
    return { categories, isLoading, error };
}