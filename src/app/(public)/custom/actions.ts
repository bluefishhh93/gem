"use server"

import { getCharms } from "@/data-access/charms";
import { getStrings } from "@/data-access/strings";

export async function fetchCharms() {
  return await getCharms();
}

export async function fetchStrings() {
  return await getStrings();
}