import { NextResponse } from 'next/server';
import { getCategoriesUseCase } from '@/use-cases/categories';

export async function GET() {
  try {
    const categories = await getCategoriesUseCase();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}