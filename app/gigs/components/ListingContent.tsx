import { CardHeader } from "@heroui/react";
import { ListingImage } from "./ListingImage";
import { ListingVenue } from "@/app/types/types";
import { formatter } from "./_utils";
import "./ListingContent.css";

export const ListingContent = ({ listing }: ListingVenue) => {
  const cname = listing.highlighted
    ? "listing-wrapper listing sponsored"
    : listing.patreon
      ? "listing-wrapper listing patreon"
      : "listing-wrapper listing";

  return (
    <>
      {/* <CardHeader>
        <div className="flex flex-col gap-2 cursor-pointer">
          <h4 className="listing-name">{listing.name}</h4>
          <small>
            {listing.venueName} {listing.suburb}
            <br />
            {formatter.format(new Date(`2000-01-01T${listing.starttime}`))}
          </small>
          {listing.prominence && <ListingImage listing={listing} />}
        </div>
      </CardHeader> */}

      <li className={cname}>
        <div className="listing-title">{listing.name}</div>
        <div className="listing-venue">
          <div className="name">
            {listing.venueName.replace(/&amp;/g, "&")}, {listing.suburb}
          </div>
          <div className="address">{listing.address1}</div>
        </div>
        <div className="listing-time">
          {formatter.format(new Date(`2000-01-01T${listing.starttime}`))}
        </div>
        {listing.prominence && <ListingImage listing={listing} />}
      </li>
    </>
  );
};
