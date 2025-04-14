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
import { TListing } from "@/app/types/types";
import { ListingContent } from "./ListingContent";

export function Listing({ gig }: { gig: TListing }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <li onClick={onOpen}>
        <Card className="max-w-[400px] my-5 lato">
          <ListingContent gig={gig as TListing} />
        </Card>
      </li>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {gig.artist} @ {gig.name}
              </ModalHeader>
              <ModalBody>
                <h4 className="font-bold uppercase text-large">{gig.artist}</h4>
                <h5 className="text-default-500 text-tiny">{gig.start}</h5>
                <p className="text-tiny font-bold">{gig.name}</p>
                <small className="text-default-500">
                  {gig.address}, {gig.suburb}, {gig.zip} {gig.state}
                </small>

                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={gig.location_image_url}
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
