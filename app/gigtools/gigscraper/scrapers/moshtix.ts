"use server";

import axios from 'axios';
import fs from 'fs';

export async function moshtix() {
  try {
    const query = `
      query {
        viewer {
          getEvents(pageIndex: 0, pageSize: 100, sortBy: STARTDATE, sortByDirection: ASC, eventStartDateFrom: "${new Date().toISOString().split('T')[0]}", genreIds: [43, 44, 11, 7, 19, 16, 15, 12, 17, 45]) {
            totalCount
            items {
              name
              startDate
              venue {
                name
                address {
                  locality
                  line1
                  postCode
                }
              }
              genre {
                id
                name
              }
            }
          }
        }
      }`;

    const response = await axios.post(
      'https://api.moshtix.com/v1/graphql/',
      { query },
      {
        headers: {
          'User-Agent': 'Node.js Script',
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    );

    const results = response.data.data.viewer.getEvents.items;
    console.log(results);
    const gigArray:any[] = [];

    results.forEach((item: any) => {
      const eventStartTime = new Date(item.startDate).toLocaleTimeString('en-GB', { hour12: false });
      const eventStartDate = new Date(item.startDate).toISOString().split('T')[0];
     
      const eventName = item.name;
      const eventUrl = item.eventUrl;

      let eventStartTimeFormatted = eventStartTime || '20:00:01';

      const gigObj = {
        artist: eventName,
        startdate: eventStartDate,
        starttime: eventStartTimeFormatted,
        venue: item.venue.name,
        artisturl: eventUrl,
        location_name: item.venue.name
      };

      gigArray.push(gigObj);
    });

    const gigJSON = JSON.stringify(gigArray, null, 2);

    fs.writeFileSync('./app/gigtools/data/moshtix.json', gigJSON);

    return gigJSON; 
  } catch (error) {
    console.error('Error fetching data:', error);
    
  }
}
