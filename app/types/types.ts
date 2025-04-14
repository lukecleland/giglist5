export type TGiglistApiResponse = {
    status: number;
    statusText: string;
    data: TDate[];
    error: any;
    loading: boolean;
};

export type TListing = {
    id: number;
    lat: string;
    lng: string;
    name: string;
    artist: string;
    artist_url: string;
    address: string;
    suburb: string;
    location_url: string;
    start: string;
    date_formatted: string;
    date: string;
    state: string;
    zip: string;
    location_image_url?: string;
    answer: string;
    datestamp: {
        date: Date | string;
    };
    prominence?: number;
};

export type TDate = {
    datestring: string;
    datetime: string;
    listings: TListing[];
};

export type TGiglist = TDate[];

export type GigAd = {
    Name: string;
    image: { url: string }[];
    link: string;
    Active: boolean;
    Postcode_Prefixes: string;
};

export type TAllTimeCount = {
    count: number;
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


declare global {
    interface JQuery {
        printArea(): void;
    }
}
