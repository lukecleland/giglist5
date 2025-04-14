"use server";

import { query } from "@/lib/db";

export async function getSlugs(): Promise<
  { slug: string; [key: string]: any }[]
> {
  const result = await query(`SELECT * FROM gl_venues`);
  return result as any[]; // or define a Venue type if you want stricter typing
}
