"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Image,
  Card,
  Link,
} from "@heroui/react";
import { ListingVenue } from "@/app/types/types";
import { ListingContent } from "./ListingContent";
import { lato } from "@/config/fonts";
import { formatDateWithSuffix, formatter } from "./_utils";
import { siteConfig } from "@/config/site";
import { TwitterIcon } from "@/components/icons";

export function ListingModal({ listing }: ListingVenue) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div onClick={onOpen}>
        <ListingContent listing={listing} />
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        className={lato.className}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {listing.name} @ {listing.venueName}
              </ModalHeader>
              <ModalBody>
                <Image
                  className="object-cover rounded-xl"
                  src={listing.heroImage || " "}
                  width={1000}
                />
                <small>
                  {listing.address1}, {listing.suburb}, {listing.postcode}{" "}
                  {listing.state}
                </small>
                <h2>
                  {formatter.format(
                    new Date(`2000-01-01T${listing.starttime}`)
                  )}
                </h2>
                <Link
                  isExternal
                  aria-label="Twitter"
                  href={siteConfig.links.twitter}
                >
                  <TwitterIcon className="text-default-500" />
                </Link>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
