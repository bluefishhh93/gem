import { String, NewString, strings } from "@/db/schema";
import { database } from "@/db";
import { eq } from "drizzle-orm";

export async function createString(string: NewString) {
    await database.insert(strings).values(string);
}

export async function getStrings() {
    return await database.select().from(strings);
}

export async function getStringById(id: number) {
    return await database.query.strings.findFirst({
        where: eq(strings.id, id),
    });
}

export async function updateString(id: number, string: Partial<String>) {
    await database.update(strings).set(string).where(eq(strings.id, id));
}

export async function deleteString(id: number) {
    await database.delete(strings).where(eq(strings.id, id));
}