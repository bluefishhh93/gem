import { Charm, NewCharm, charms } from "@/db/schema";
import { database } from "@/db";
import { eq } from "drizzle-orm";

export async function createCharm(
    charm: NewCharm
) {
    await database.insert(charms).values(charm);
}

export async function getCharms() {
    return await database.select().from(charms);
}

export async function getCharmById(id: number) {
    return await database.select().from(charms).where(eq(charms.id, id));
}

export async function updateCharm(id: number, charm: Charm) {
    await database.update(charms).set(charm).where(eq(charms.id, id));
}

export async function deleteCharm(id: number) {
    await database.delete(charms).where(eq(charms.id, id));
}