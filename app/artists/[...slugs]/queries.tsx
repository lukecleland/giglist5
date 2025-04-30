"use server";

import { Venue } from "@/app/types/types";
import { query } from "@/lib/db";

export async function getSlugs(): Promise<Venue[]> {
  const result = (await query(`SELECT * FROM gl_venues`)) as Venue[];

  // remove empty slugs
  const filteredResult = result.filter(
    (venue: Venue) => venue.slug && venue.slug.length > 0
  );

  return filteredResult as Venue[];
}
