"use server";

import { Venue } from "@/app/types/types";
import { query } from "@/lib/db";

export async function getSlugs(): Promise<Venue[]> {
  const result = await query(`SELECT * FROM gl_venues`);
  return result as Venue[]; // or define a Venue type if you want stricter typing
}
