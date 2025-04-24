export type Listing = {
    id: number;
    name: string;
    url: string;
    starttime: string;
    startdate: string;
    venueName: string;
    prominence?: number;
    wheelchairAccessible?: boolean;
    minPrice?: number;
    categories?: [];
    tourName?: string;
    coversOriginals?: ['covers' | 'originals'];
    ageRestricted?: boolean;
    artists?: [];
    type?: ['Festival' | 'Concert' | 'Pub'];
    recommended?: boolean;
    highlighted?: boolean;
    patreon?: boolean;
    specialGuests?: string;
    listedBy?: number;
    holdingId?: number;
    isPublished: number;
}


export type THolding = {
    id: number;
    artist: string;
    originalArtist: string;
    hidden: number;
    starttime: string;
    startdate: string;
    linkedVenueId: number;
    linkedVenue: string;
    scraper: string;
    venue: string;
}
    

export type ListingDate = {
    datestring: string;
    datetime: string;
    listings: Listing[];
};

export type ListingDates = ListingDate[];

export type GigAd = {
    Name: string;
    image: { url: string }[];
    link: string;
    Active: boolean;
    Postcode_Prefixes: string;
};

export type Venue = {
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

  export type Venues = Venue[];