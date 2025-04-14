
"use server";

const exmaple = {
  EventId: 212467,
  EventGuid: '519048f9-6807-43ee-a187-9a6b267d5293',
  EventName: 'Rumours: A Tribute to Fleetwood Mac',
  MinPrice: 0,
  PriceBreakdown: null,
  EventImage1: 'https://assets.oztix.com.au/image/a154e5b6-3dbd-4aef-be6d-3d629bb75387.png?width=600&height=300',
  HomepageImage: 'https://assets.oztix.com.au/image/d8f9f9cf-143d-4634-8d97-ead720a9dc4a.png?width=360',
  SpecialGuests: '',
  EventDescription: '<p>Sydney’s best Fleetwood Mac show captures the band’s sound from the legendary Rumours album and includes their hits from the early blues period to the contemporary hits.</p><p>The success of Rumours as one of the biggest selling albums of all time has made this show one of the hottest tickets in town. Fleetwood Mac have an eclectic catalogue and this great Sydney based band with carefully chosen singers to bring some gorgeous interpretations of some of your favourite songs. Enjoy the hits from Dreams, Little Lies, Albatross, The Chain, Sarah, Don’t Stop, Landslide, Go Your Own Way, Rhianon and more…</p><p>Line up:<br>Rex Goh &nbsp;– guitar<br>Tim Wedde – keys &amp; vocals<br>Steve Bull – bass<br>Lloyd G – drums<br>Amanda Easton – vocals<br>Sarina&nbsp;Jennings - vocals<br>Floyd Vincent – vocals &amp; guitar<br><br>&nbsp;</p><iframe height="315" sandbox="allow-scripts allow-same-origin" src="https://www.youtube.com/embed/5s3sIQCPNU4?si=HTp_ltlwTGOAiK6M" title="YouTube video player" width="560"></iframe>',
  DateStart: '2026-10-10T07:30:00',
  DateStartUnix: 1791617400,
  DateEnd: null,
  DateEndUnix: 0,
  EventUrl: 'https://tickets.oztix.com.au/outlet/event/519048f9-6807-43ee-a187-9a6b267d5293?utm_source=Oztix&utm_medium=Website',
  Categories: [
    'Music',
    'Dinner & Show',
    'Adult',
    'Food and Wine',
    'POP',
    'Rock',
    'Tribute'
  ],
  _geoloc: { lat: -34.05494689941406, lng: 151.1516265869141 },
  Venue: {
    Id: 527,
    ExternalReference: '6ec351be-61f4-4baa-837d-b9487a5b8a35',
    Name: 'Brass Monkey',
    Address: '115 A Cronulla St',
    Locality: 'Cronulla',
    State: 'NSW',
    Postcode: '2030',
    PhoneNumber: '02 9544 3844',
    WebsiteUrl: 'https://www.brassmonkey.com.au',
    Timezone: 'Australia/Sydney',
    SearchKeywords: []
  },
  EventSearchKeywords: [],
  Bands: [ 'Rumours' ],
  TourName: null,
  FullCategories: [
    '/category/music/',
    '/category/dinner-show/',
    '/category/adult/',
    '/category/food-and-wine/',
    '/category/pop-music-/',
    '/category/rock-music-/',
    '/category/tribute-music-/'
  ],
  DateStartMonth: 10,
  DateStartWeek: 41,
  DateStartMonthName: 'October',
  IsCancelled: false,
  IsPostponed: false,
  IsRescheduled: false,
  Affected: false,
  AffectedBy: null,
  PriceFrom: 38.15,
  AvailabilityDate: '2025-04-04T11:54:26.9765123+11:00',
  ExpirationDate: '2026-10-10T18:30:00+11:00',
  Availability: true,
  HasEventDatePassed: false,
  Brand: 0,
  OutletId: 109,
  OutletFriendlyName: 'Oztix Home Page',
  LastModifiedUtc: '2025-04-04T04:50:20.8052311Z',
  objectID: 'event-212467'
};

import fs from 'fs';
import algoliasearch from 'algoliasearch';

const categoriesFilter = [
  'POP',
  'Rock',
  'Alternative', 
  'Metal / Hard Rock',
  'Indie', 
  'Australian Artists',
  'Country',
  'Heavy Metal',
  'Punk',
  'Grunge',
  'Acoustic',
  'Folk',
  'Jazz',
  'Blues',
  'Alt Country',
  'Soul',
  'Ska',
  'Reggae',
  'Funk',
  'Emo',
  'Bluegrass',
]

const unwantedCategories = [
'Arts',
'Adult',
'Cabaret',
'Burlesque',
'LGBTIQ+',
'Beer',
'Horse Racing',
'Dinner & Show',
'Adult',
'Boat Cruise',
'Dance',
'Male Revue',
'Special Days',
'Rugby League', 
'R N B',
'Conference', 
'Luncheon',
'Adult', 
'Comedy', 
'Dance', 
'Drag', 
'Bingo'];

export async function oztix() {
  try {
    const client = algoliasearch('ICGFYQWGTD', 'ab8ff3de382a1d2764ade5da283ba871');
    const index = client.initIndex('prod_oztix_eventguide');

    const gigArray: GigObject[] = [];
    const now = new Date();
    const oneWeekLater = new Date(now);
    oneWeekLater.setDate(now.getDate() + 7);

    // Use browseObjects with a callback to paginate through all objects
    interface EventData {
      Availability?: boolean;
      HasEventDatePassed?: boolean;
      EventName: string;
      ExpirationDate?: string;
      Venue?: {
        Name?: string;
      };
      EventUrl?: string;
      Categories?: string[];
    }

    interface GigObject {
      artist: string;
      startdate: string;
      starttime: string;
      venue: string;
      artisturl?: string;
      location_name: string;
    }

    await index.browseObjects({
      query: '', 
      batch: (batch: ReadonlyArray<EventData & { objectID: string }>) => {
        batch.forEach((data: EventData) => {
          if (!data.Availability || data.HasEventDatePassed) return;

          // Filter out unwanted categories
          const categories = data.Categories;
          
          const hasValidCategory = categories?.some((category) => categoriesFilter.includes(category));
          const hasUnwantedCategory = categories?.some((category) => unwantedCategories.includes(category));
          if (hasUnwantedCategory) return;
          if (!hasValidCategory) return;

          console.log('Categories:', categories);

          const gigArtist = data.EventName;
          let startDateRaw = data.ExpirationDate?.slice(0, -6);

          let startDate = startDateRaw ? new Date(startDateRaw) : new Date(NaN);
          if (isNaN(startDate.getTime())) return;

          const gigStartTime = startDate.toLocaleTimeString('en-GB', { hour12: false });
          const gigStartDate = startDate.toISOString().split('T')[0];

          if (startDate > oneWeekLater || startDate < now) return;

          const gigVenue = data.Venue?.Name || 'Unknown Venue';
          const gigArtistUrl = data.EventUrl;

          if (!gigArtist.includes('CANCELLED') && !gigArtist.includes('POSTPONED')) {
            const gigObj = {
              artist: gigArtist,
              startdate: gigStartDate,
              starttime: gigStartTime,
              venue: gigVenue,
              artisturl: gigArtistUrl,
              location_name: gigVenue,
            };

            gigArray.push(gigObj);
          }
        });
      },
    });
    const gigJSON = JSON.stringify(gigArray, null, 2);

    fs.writeFileSync('./app/gigtools/data/oztix.json', gigJSON);

    return gigJSON;

  } catch (err) {
    console.error('Error fetching Oztix data:', err);
  }
}
