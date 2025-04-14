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
    url
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
    location_url
FROM wpdr_eme_locations;
