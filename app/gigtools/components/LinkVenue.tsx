import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { searchVenue, linkVenue } from "@/app/gigtools/api/queries";
import { useState } from "react";
import { lato } from "@/config/fonts";
import { THolding, Venue, Venues } from "@/app/types/types";

function htmlEnc(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&#34;");
}

export const LinkVenue = ({
  holding,
  item,
  label,
  venue,
  color,
  onSuccess,
  disabled,
}: {
  holding: THolding[];
  item: THolding;
  label: string;
  venue: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  onSuccess?: () => void;
  disabled?: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [holdingId, setHoldingId] = useState(0);
  const [venueToBeLinked, setVenueToBeLinked] = useState("");
  const [searchResults, setSearchResults] = useState<Venues>([]);

  function openModal(holdingId: number) {
    setHoldingId(holdingId);
    setVenueToBeLinked(
      holding.find((item: THolding) => item.id === holdingId)?.venue ?? ""
    );
    // open modal
    onOpen();
    // autofocus to search
    setTimeout(() => {
      const input = document.querySelector("input[name='search']");
      if (input) {
        (input as HTMLInputElement).focus();
      }
    }, 0);

    const quickVenueSearch = venue.replace(/The /g, "").substring(0, 5);
    console.log(quickVenueSearch);

    searchVenue(quickVenueSearch).then((res) => {
      setSearchResults(JSON.parse(res));
    });
  }

  function searchVenues(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchResults([]);
    searchVenue(e.target.value).then((res) => {
      setSearchResults(JSON.parse(res));
    });
  }

  return (
    <>
      <Button
        size="sm"
        onPress={() => openModal(item.id)}
        color={color}
        isDisabled={disabled}
      >
        {label}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent className={lato.className}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {venueToBeLinked}
              </ModalHeader>
              <ModalBody key={holdingId}>
                <div
                  className="flex w-full flex-wrap md:flex-nowrap gap-4"
                  key={holdingId}
                >
                  <Input
                    label="Link Venue"
                    placeholder="Search"
                    type="text"
                    name="search"
                    onChange={searchVenues}
                  />
                </div>
                {searchResults.map((item: Venue, index: number) => (
                  <div key={index}>
                    <Button
                      key={index}
                      size="sm"
                      onPress={() => {
                        linkVenue(item.id, holdingId).then(() => {
                          if (onSuccess) onSuccess();
                          onClose();
                        });
                      }}
                    >
                      {htmlEnc(item.name)}, {item.address1}, {item.suburb},{" "}
                      {item.state}
                    </Button>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
