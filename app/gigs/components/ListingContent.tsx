import { CardHeader } from "@heroui/react";
import { ListingImage } from "./ListingImage";
import { TListing } from "@/app/types/types";

export const ListingContent = ({gig}: {gig: TListing}) => {
    if (gig.prominence === 1) {
      return (
        <>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold uppercase text-large">
              {gig.artist} {gig.date_formatted}
            </h4>
            <p className="text-default-500 text-tiny">{gig.name}</p>
            <p className="text-default-500 text-tiny">{gig.start}</p>
            <small className="text-default-500">
              {gig.address}, {gig.suburb}, {gig.zip} {gig.state}
            </small>
          </CardHeader>
          <ListingImage gig={gig} />
        </>
      );
    } else {
      return (
        <>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold uppercase text-small">{gig.artist}</h4>
            <p className="text-default-500 text-tiny">{gig.name}</p>
            <p className="text-default-500 text-tiny">{gig.start}</p>
  
            <small className="text-default-500">
              {gig.address}, {gig.suburb}, {gig.zip} {gig.state}
            </small>
          </CardHeader>
        </>
      );
    }
  };