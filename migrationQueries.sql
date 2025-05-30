/**
* Migration script to copy data from wpdr_eme_locations to gl_venues.
* This script assumes that the gl_venues table already exists and has the same structure as the wpdr_eme_locations table.
* 
* Note: Ensure that you have a backup of your database before running this migration.
*/

INSERT INTO gl_venues (
    address1, 
    heroImage,
    lat,
    lng,
    name,
    postcode,
    slug,
    state,
    suburb,
    url,
    legacyVenueId
)
SELECT 
    location_address1,
    location_image_url,
    location_latitude,
    location_longitude,
    location_name,
    location_zip,
    location_slug,
    location_state,
    location_city,
    location_url,
    location_id
FROM wpdr_eme_locations;


/**
* Migration script to copy data to gl_listings from wpdr_eme_events and wpdr_eme_locations.
* Note: Ensure that you have a backup of your database before running this migration.
*/


INSERT INTO gl_listings (
    name,
    slug,
    startdate,
    starttime,
    url,
    venueId,
    legacyVenueId,
    legacyListingId
)
SELECT 
    e.event_name,
    e.event_slug,
    e.event_start_date,
    e.event_start_time,
    e.event_url,
    v.id AS venueId,
    v.legacyVenueId,
    e.event_id AS legacyListingId
FROM wpdr_eme_events e
JOIN wpdr_eme_locations l ON e.location_id = l.location_id
JOIN gl_venues v ON v.name = l.location_name
                AND v.suburb = l.location_city
;

