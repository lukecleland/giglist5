import { ListingDate, Listing } from "@/app/types/types";
import { ListingItem } from "./ListingItem";

type ListingDatesProps = {
  listingDates: ListingDate[];
};

export function ListingDates({ listingDates }: ListingDatesProps) {
  return (
    <ul>
      {listingDates.map((listingDate: ListingDate) => (
        <li key={listingDate.datetime} className="m-2">
          <div>{listingDate.datestring}</div>
          <ul>
            {listingDate.listings.map((listing: Listing) => {
              return <ListingItem listing={listing} key={listing.id} />;
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
