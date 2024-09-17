import { Category, NewCategory, categories } from "@/db/schema";
import { database } from "@/db";
import { eq } from "drizzle-orm";

export async function createCategory(category: NewCategory) {
    const [newCategory] = await database.insert(categories).values(category).returning();
    return newCategory;
}

export async function getCategories() {
    return await database.select().from(categories).where(eq(categories.isActive, true));
}

export async function getCategoryById(id: number) {
    return await database.query.categories.findFirst({
        where: eq(categories.id, id),
    });
}

export async function updateCategory(id: number, category: Partial<Category>) {
    const [updatedCategory] = await database.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updatedCategory;
}

export async function deleteCategory(id: number) {
    await database.delete(categories).where(eq(categories.id, id));
}