"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

function sqlparam(value: string) {
  if (value === null || value === undefined) return "";
  return value.replace(/'/g, "\\'");
}

/**
 * Search for venues in the database
 * @param searchText
 * @returns
 */
export async function searchVenue(searchText: string) {
  if (searchText.length < 3) {
    return "[]";
  }
  const result = await query(
    `SELECT * FROM gl_venues WHERE name LIKE '%${sqlparam(
      searchText
    )}%' LIMIT 10`
  );

  return JSON.stringify(result);
}

/**
 * Get all venues from the database
 * @param limit
 */
export async function selectVenues(limit: number = 100) {
  const result = await query(
    `SELECT * FROM gl_venues ORDER BY name ASC LIMIT ${limit}`
  );
  return JSON.stringify(result);
}

/**
 * Get a single venue by ID
 * @param id
 */
export async function selectVenue(id: number) {
  const result: any = await query(
    `SELECT * FROM gl_venues WHERE id = ${id} LIMIT 1`
  );
  if (result.length === 0) {
    return null;
  }
  return result[0];
}

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

/**
 * Add a new venue to the database
 * @param item
 */
export async function addVenue(item: Venue) {
  const theQuery = `
    INSERT INTO gl_venues (name, address1, suburb, state, postcode, url, lat, lng, heroImage, slug, description, phone, email)
      VALUES
    (
      '${sqlparam(item.name)}',
      '${sqlparam(item.address1)}',
      '${sqlparam(item.suburb)}',
      '${sqlparam(item.state)}',
      '${sqlparam(item.postcode)}',
      '${sqlparam(item.url)}',
      '${sqlparam(item.lat)}',
      '${sqlparam(item.lng)}',
      '${item.heroImage}',
      '${item.slug}',
      '${sqlparam(item.description)}',
      '${item.phone}',
      '${item.email}'
    )
`;
  console.log("addVenue query:", theQuery);
  await query(theQuery);
  revalidatePath(`/`);
}

/**
 * Update an existing venue in the database
 * @param item
 */
export async function updateVenue(item: Venue & { venueId: number }) {
  const theQuery = `
    UPDATE gl_venues
    SET name = '${sqlparam(item.name)}',
        address1 = '${sqlparam(item.address1)}',
        suburb = '${sqlparam(item.suburb)}',
        state = '${sqlparam(item.state)}',
        postcode = '${sqlparam(item.postcode)}',
        url = '${sqlparam(item.url)}',
        lat = '${sqlparam(item.lat)}',
        lng = '${sqlparam(item.lng)}',
        heroImage = '${item.heroImage}',
        slug = '${item.slug}',
        description = '${sqlparam(item.description)}',
        phone = '${item.phone}',
        email = '${item.email}'
    WHERE id = ${item.venueId}
  `;
  console.log("updateVenue query:", theQuery);
  await query(theQuery);
  revalidatePath(`/`);
}

/**
 * Link a venue to a holding record
 * @param linkedVenueId
 * @param holdingId
 */
export async function linkVenue(linkedVenueId: number, holdingId: number) {
  const theQuery = `UPDATE gl_holding SET linkedVenueId = ${linkedVenueId} WHERE id = '${holdingId}'`;

  console.log("linkVenue query:", theQuery);
  await query(theQuery);
}

/**
 * Get all listings from the database
 * @param limit
 */
export async function getListings(limit: number = 100) {
  const result = await query(
    `SELECT *, gl_listings.id as id, gl_listings.name as name, gl_venues.name as venueName FROM gl_listings  
      LEFT JOIN gl_venues ON gl_listings.venueId = gl_venues.id
      ORDER BY startdate ASC LIMIT ${limit}`
  );
  return result;
}

/**
 * Get listings filtered by holdingId
 */
export async function getListingsByHoldingIds(holdingIds: number[]) {
  if (holdingIds.length === 0) {
    return [];
  }
  const theQuery = `SELECT *, gl_listings.id as id, gl_listings.name as name, gl_venues.name as venueName FROM gl_listings  
    LEFT JOIN gl_venues ON gl_listings.venueId = gl_venues.id
    WHERE holdingId in (${holdingIds.join(",")})`;

  console.log("getListingsByHoldingIds query:", theQuery);
  const result = await query(theQuery);
  return result;
}

/**
 * Add a new listing to the database
 * @param item
 */
export async function addListing(item: {
  description: string;
  image: string;
  name: string;
  slug: string;
  startdate: string;
  starttime: string;
  url: string;
  venueId: number;
  holdingId: number;
}) {
  const theQuery = `
    INSERT INTO gl_listings (description, image, name, slug, startdate, starttime, url, venueId, holdingId)
      VALUES
    (
      '${sqlparam(item.description)}',
      '${item.image}',
      '${sqlparam(item.name)}',
      '${sqlparam(item.slug)}',
      '${item.startdate}',
      '${item.starttime}',
      '${sqlparam(item.url)}',
      ${item.venueId},
      ${item.holdingId}
    )
  `;
  console.log("addListing query:", theQuery);
  await query(theQuery);
  revalidatePath(`/`);
}

/**
 * Update an existing listing in the database
 * @param item
 */
export async function updateListing(item: {
  id: number;
  description: string;
  image: string;
  name: string;
  slug: string;
  startdate: string;
  starttime: string;
  url: string;
  venueId: number;
  holdingId: number;
}) {
  const theQuery = `
    UPDATE gl_listings
    SET description = '${sqlparam(item.description)}',
        image = '${item.image}',
        name = '${sqlparam(item.name)}',
        slug = '${item.slug}',
        startdate = '${item.startdate}',
        starttime = '${item.starttime}',
        url = '${sqlparam(item.url)}',
        venueId = ${item.venueId},
        holdingId = ${item.holdingId}
    WHERE id = ${item.id}
`;
  console.log("updateListing query:", theQuery);
  await query(theQuery);
}

/**
 * Delete a listing from the database
 * @param id
 */
export async function deleteListing(id: number) {
  const theQuery = `
    DELETE FROM gl_listings
    WHERE id = ${id}
  `;
  console.log("deleteListing query:", theQuery);
  await query(theQuery);
  revalidatePath(`/`);
}

/**
 * Update the artist name in a holding record
 * @param holdingId
 * @param artist
 */
export async function updateHoldingArtist(holdingId: number, artist: string) {
  const theQuery = `UPDATE gl_holding SET artist = '${sqlparam(
    artist
  )}' WHERE id = '${holdingId}'`;

  console.log("updateHoldingArtist query:", theQuery);
  await query(theQuery);
}

/**
 * Delete a holding record
 * @param holdingId
 */
export async function deleteHolding(holdingId: number) {
  await query(`DELETE FROM gl_holding WHERE id = '${holdingId}'`);
}

/**
 * Insert a new holding record
 * @param item
 */
export async function addToHolding(item: {
  artist: string;
  venue: string;
  starttime: string;
  startdate: string;
  hidden: boolean;
  scraper: string;
}) {
  const q = `
    INSERT INTO gl_holding 
      (artist, originalArtist, venue, starttime, startdate, hidden, scraper) 
      VALUES 
        ('${sqlparam(item.artist)}', 
        '${sqlparam(item.artist)}', 
        '${sqlparam(item.venue)}', 
        '${item.starttime}', 
        '${item.startdate}',
        ${item.hidden},
        '${item.scraper}'
    )`;
  console.log("addToHolding query:", q);
  await query(q);
  revalidatePath("/");
}

/**
 * Returns all holding records
 * @returns
 * @todo Add only future gigs - requires updating startdate to datetime in mysql
 */
export async function selectHolding(scraper: string) {
  return await query(
    `SELECT *, gl_holding.id as id, gl_venues.name as linkedVenue FROM gl_holding 
      LEFT JOIN gl_venues ON gl_holding.linkedVenueId = gl_venues.id
      WHERE scraper = '${scraper}'
      ORDER BY startdate ASC`
  );
}
