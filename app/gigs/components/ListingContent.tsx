import { CardHeader } from "@heroui/react";
import { ListingImage } from "./ListingImage";
import { Listing } from "@/app/types/types";

export const ListingContent = ({ listing }: { listing: Listing }) => {
  if (listing.prominence === 1) {
    return (
      <>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold uppercase text-large">
            {listing.name} {listing.startdate}
          </h4>
          <p className="text-default-500 text-tiny">{listing.venueName}</p>
          <p className="text-default-500 text-tiny">{listing.starttime}</p>
          <small className="text-default-500">
            {listing.address1}, {listing.suburb}, {listing.postcode}{" "}
            {listing.state}
          </small>
        </CardHeader>
        <ListingImage listing={listing} />
      </>
    );
  } else {
    return (
      <>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold uppercase text-small">{listing.name}</h4>
          <p className="text-default-500 text-tiny">{listing.venueName}</p>
          <p className="text-default-500 text-tiny">{listing.starttime}</p>

          <small className="text-default-500">
            {listing.address}, {listing.suburb}, {listing.postcode}{" "}
            {listing.state}
          </small>
        </CardHeader>
      </>
    );
  }
};
