import { CardHeader } from "@heroui/react";
import { ListingImage } from "./ListingImage";
import { ListingVenue } from "@/app/types/types";
import { formatter } from "./_utils";

export const ListingContent = ({ listing }: ListingVenue) => {
  return (
    <>
      <CardHeader>
        <div className="flex flex-col gap-2 cursor-pointer">
          <h4 className="uppercase">{listing.name}</h4>
          <small>
            {listing.venueName} {listing.suburb}
            <br />
            {formatter.format(new Date(`2000-01-01T${listing.starttime}`))}
          </small>
          {listing.prominence && <ListingImage listing={listing} />}
        </div>
      </CardHeader>
    </>
  );
};
