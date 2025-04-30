export type Listing = {
    id: number;
    name: string;
    url: string;
    starttime: string;
    startdate: string;
    venueName: string;
    prominence?: boolean;
    wheelchairAccessible?: boolean;
    minPrice?: number;
    categories?: string;
    tourName?: string;
    coversOriginals?: string;
    ageRestricted?: boolean;
    artists?: string;
    type?: string;
    recommended?: boolean;
    highlighted?: boolean;
    patreon?: boolean;
    specialGuests?: string;
    listedBy?: number;
    holdingId?: number;
    isPublished?: boolean;
    description?: string;
    image?: string;
    slug?: string;
    venueId: number;
}

export type ListingVenue = {
    listing: Listing & Venue;
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
    listings: ListingVenue[];
};

export type GigAd = {
    id: number;
    name: string;
    image: { url: string }[];
    link: string;
    active: boolean;
    postcodePrefixes: string;
};

export type Venue = {
    id: number;
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