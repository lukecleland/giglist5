import { TDate, TListing } from "@/app/types/types";
import { Listing } from "./Listing";

export function DateList({ dates }: { dates: TDate[] }) {
  return (
    <ul>
      {dates.map((date: TDate) => (
        <li key={date.datetime} className="m-2">
          <div className="merriweather">{date.datestring}</div>
          <ul>
            {date.listings.map((gig: TListing) => {
              return <Listing gig={gig} key={gig.id} />;
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
