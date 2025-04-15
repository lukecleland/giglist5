import { Listing } from "@/app/types/types";
import { CardBody, Image } from "@heroui/react";

export const ListingImage = ({ listing }: { listing: Listing }) => {
  if (!listing.venueImage) {
    return null;
  }

  return (
    <CardBody className="overflow-visible py-2">
      <Image
        alt="Card background"
        className="object-cover rounded-xl"
        src={listing.venueImage}
        width={300}
        height={300}
        isBlurred={true}
        isZoomed={true}
      />
    </CardBody>
  );
};
