import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "@/data-access/categories";
import { Category, NewCategory } from "@/db/schema";

export async function createCategoryUseCase(category: NewCategory) {
    return createCategory(category);
}

export async function getCategoriesUseCase() {
    return getCategories();
}

export async function getCategoryByIdUseCase(id: number) {
    return getCategoryById(id);
}

export async function updateCategoryUseCase(id: number, category: Partial<Category>) {
    return updateCategory(id, category);
}

export async function deleteCategoryUseCase(id: number) {
    return deleteCategory(id);
}