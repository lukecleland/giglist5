import { TListing } from "@/app/types/types";
import { CardBody, Image } from "@heroui/react";

export const ListingImage = ({ gig }: { gig: TListing }) => {
    if (!gig.location_image_url) {
      return null;
    }
  
    return (
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={gig.location_image_url}
          width={300}
          height={300}
          isBlurred={true}
          isZoomed={true}
        />
      </CardBody>
    );
  };