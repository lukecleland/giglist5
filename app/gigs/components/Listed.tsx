"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { Listing } from "@/app/types/types";
import { ListingContent } from "./ListingContent";

export function Listed({ listing }: { listing: Listing }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <li onClick={onOpen}>
        <Card className="max-w-[400px] my-5 lato">
          <ListingContent listing={listing as Listing} />
        </Card>
      </li>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {listing.name} @ {listing.venueName}
              </ModalHeader>
              <ModalBody>
                <h4 className="font-bold uppercase text-large">
                  {listing.name}
                </h4>
                <h5 className="text-default-500 text-tiny">
                  {listing.starttime}
                </h5>
                <p className="text-tiny font-bold">{listing.venueName}</p>
                <small className="text-default-500">
                  {listing.address1}, {listing.suburb}, {listing.postcode}{" "}
                  {listing.state}
                </small>

                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={listing.url}
                  width={1000}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
