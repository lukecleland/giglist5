import { ListingDate, Listed } from "@/app/types/types";
import { Listing } from "@/app/types/types";

export function DateList({ dates }: { dates: ListingDate[] }) {
  return (
    <ul>
      {dates.map((date: ListingDate) => (
        <li key={date.datetime} className="m-2">
          <div className="merriweather">{date.datestring}</div>
          <ul>
            {date.listings.map((listing: Listing) => {
              return <Listing listing={listing} key={listing.id} />;
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
