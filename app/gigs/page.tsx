import { ListingDates } from "./components/ListingDates";
import { ListingDate } from "@/app/types/types";
import { getListings } from "../gigtools/api/queries";

export default async function GigsPage() {
  const listings = await getListings();

  return (
    <div className="w-full">
      <div>
        <ListingDates listingDates={listings as ListingDate[]} />
      </div>
    </div>
  );
}
