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
} from "@heroui/react";
import { ListingVenue } from "@/app/types/types";
import { ListingContent } from "./ListingContent";
import { lato } from "@/config/fonts";

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
                <small className="text-default-500">
                  {listing.address1}, {listing.suburb}, {listing.postcode}{" "}
                  {listing.state}
                </small>
                <h2 className="text-default-500 text-tiny">
                  {listing.starttime}
                </h2>
                <Image
                  className="object-cover rounded-xl"
                  src={listing.heroImage || " "}
                  width={1000}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
