"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  venueCache,
  listingCache,
  searchCache,
  withDeduplication,
} from "@/lib/cache";

// Debounce utility for search functions
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout;
  let resolvePromise: (value: ReturnType<T>) => void;
  let rejectPromise: (error: any) => void;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      resolvePromise = resolve;
      rejectPromise = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolvePromise(result);
        } catch (error) {
          rejectPromise(error);
        }
      }, delay);
    });
  };
}

/**
 * Search for venues in the database with caching and debouncing
 * @param searchText
 * @returns
 */
export const searchVenue = debounce(async (searchText: string) => {
  if (searchText.length < 3) {
    return "[]";
  }

  const cacheKey = `venue_search_${searchText.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  return withDeduplication(cacheKey, async () => {
    const result = await query(
      `SELECT * FROM gl_venues WHERE name LIKE ? ORDER BY name ASC LIMIT 10`,
      [`%${searchText}%`]
    );

    const jsonResult = JSON.stringify(result);
    searchCache.set(cacheKey, jsonResult, 60000); // 1 minute TTL
    return jsonResult;
  });
}, 300); // 300ms debounce

/**
 * Get venues with pagination and caching
 * @param limit
 * @param offset
 */
export async function selectVenues(limit: number = 50, offset: number = 0) {
  const cacheKey = `venues_${limit}_${offset}`;
  const cached = venueCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  return withDeduplication(cacheKey, async () => {
    const result = await query(
      `SELECT * FROM gl_venues ORDER BY name ASC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const jsonResult = JSON.stringify(result);
    venueCache.set(cacheKey, jsonResult, 300000); // 5 minutes TTL
    return jsonResult;
  });
}

/**
 * Get total venue count for pagination
 */
export async function getVenueCount() {
  const cacheKey = "venue_count";
  const cached = venueCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  return withDeduplication(cacheKey, async () => {
    const result = await query(`SELECT COUNT(*) as count FROM gl_venues`);
    const count = (result as any)[0].count;
    venueCache.set(cacheKey, count, 300000); // 5 minutes TTL
    return count;
  });
}

/**
 * Get a single venue by ID with caching
 * @param id
 */
export async function selectVenue(id: number) {
  const cacheKey = `venue_${id}`;
  const cached = venueCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  return withDeduplication(cacheKey, async () => {
    const result = await query(`SELECT * FROM gl_venues WHERE id = ? LIMIT 1`, [
      id,
    ]);

    if ((result as any[]).length === 0) {
      return null;
    }

    const venue = (result as any[])[0];
    venueCache.set(cacheKey, venue, 300000); // 5 minutes TTL
    return venue;
  });
}

/**
 * Get listings with optimized query and caching
 * @param limit
 * @param showHistorical
 */
export async function getListings(
  limit: number = 100,
  showHistorical: boolean = false
) {
  const cacheKey = `listings_${limit}_${showHistorical}`;
  const cached = listingCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  return withDeduplication(cacheKey, async () => {
    const dateCondition = showHistorical
      ? ""
      : "AND gl_listings.startdate >= DATE(DATE_ADD(NOW(), INTERVAL -1 WEEK))";

    const result = await query(
      `
      SELECT 
        gl_listings.id,
        gl_listings.name,
        gl_listings.description,
        gl_listings.startdate,
        gl_listings.starttime,
        gl_listings.url,
        gl_listings.image,
        gl_listings.venueId,
        gl_listings.isPublished,
        gl_venues.name as venueName,
        gl_venues.lat,
        gl_venues.lng,
        gl_venues.address1,
        gl_venues.suburb,
        gl_venues.state
      FROM gl_listings
      LEFT JOIN gl_venues ON gl_listings.venueId = gl_venues.id 
      WHERE gl_venues.lat IS NOT NULL ${dateCondition}
      ORDER BY gl_listings.startdate ASC, gl_listings.starttime ASC 
      LIMIT ?
    `,
      [limit]
    );

    listingCache.set(cacheKey, result, 120000); // 2 minutes TTL
    return result;
  });
}

/**
 * Get listings filtered by holdingId with caching
 */
export async function getListingsByHoldingIds(
  holdingIds: number[],
  showHistorical: boolean = false
) {
  if (holdingIds.length === 0) {
    return [];
  }

  const cacheKey = `listings_holding_${holdingIds.sort().join(",")}_${showHistorical}`;
  const cached = listingCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  return withDeduplication(cacheKey, async () => {
    const dateCondition = showHistorical
      ? ""
      : "AND gl_listings.startdate >= DATE(DATE_ADD(NOW(), INTERVAL -1 WEEK))";

    // Use parameterized query with IN clause
    const placeholders = holdingIds.map(() => "?").join(",");
    const result = await query(
      `
      SELECT 
        gl_listings.id,
        gl_listings.name,
        gl_listings.description,
        gl_listings.startdate,
        gl_listings.starttime,
        gl_listings.url,
        gl_listings.image,
        gl_listings.venueId,
        gl_listings.holdingId,
        gl_venues.name as venueName
      FROM gl_listings  
      LEFT JOIN gl_venues ON gl_listings.venueId = gl_venues.id
      WHERE TRUE ${dateCondition}
      AND holdingId IN (${placeholders})
      ORDER BY gl_listings.startdate ASC
    `,
      holdingIds
    );

    listingCache.set(cacheKey, result, 120000); // 2 minutes TTL
    return result;
  });
}

// Cache invalidation helpers
export async function invalidateVenueCache(venueId?: number) {
  if (venueId) {
    venueCache.delete(`venue_${venueId}`);
  }
  // Clear all venue-related caches
  venueCache.clear();
  searchCache.clear();
}

export async function invalidateListingCache() {
  listingCache.clear();
}

// Original functions with cache invalidation
type Venue = {
  name: string;
  address1: string;
  suburb: string;
  state: string;
  postcode: string;
  url: string;
  lat: string;
  lng: string;
  heroImage: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
};

export async function addVenue(item: Venue) {
  await query(
    `
    INSERT INTO gl_venues (name, address1, suburb, state, postcode, url, lat, lng, heroImage, slug, description, phone, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      item.name,
      item.address1,
      item.suburb,
      item.state,
      item.postcode,
      item.url,
      item.lat,
      item.lng,
      item.heroImage,
      item.slug,
      item.description,
      item.phone,
      item.email,
    ]
  );

  await invalidateVenueCache();
  revalidatePath(`/`);
}

export async function updateVenue(item: Venue & { venueId: number }) {
  await query(
    `
    UPDATE gl_venues
    SET name = ?, address1 = ?, suburb = ?, state = ?, postcode = ?, 
        url = ?, lat = ?, lng = ?, heroImage = ?, slug = ?, 
        description = ?, phone = ?, email = ?
    WHERE id = ?
  `,
    [
      item.name,
      item.address1,
      item.suburb,
      item.state,
      item.postcode,
      item.url,
      item.lat,
      item.lng,
      item.heroImage,
      item.slug,
      item.description,
      item.phone,
      item.email,
      item.venueId,
    ]
  );

  await invalidateVenueCache(item.venueId);
  revalidatePath(`/`);
}

// Add similar optimizations for other functions...
