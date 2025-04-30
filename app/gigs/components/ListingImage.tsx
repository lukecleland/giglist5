import { ListingVenue } from "@/app/types/types";
import { CardBody, Image } from "@heroui/react";

export const ListingImage = ({ listing }: ListingVenue) => {
  if (!listing.heroImage) {
    return null;
  }

  return (
    <CardBody className="overflow-visible py-2">
      <Image
        alt="Card background"
        className="object-cover rounded-xl"
        src={listing.heroImage}
        width={300}
        height={300}
        isBlurred={true}
        isZoomed={true}
      />
    </CardBody>
  );
};
