"use client";

import { useHoldingStore } from "@/app/gigtools/store/gigtools";
import {
  updateHoldingArtist,
  deleteHolding,
  addListing,
} from "@/app/gigtools/api/queries";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Spacer,
} from "@heroui/react";

import { LinkVenue } from "./LinkVenue.tsx";
import { DownArrowIcon } from "../../icons/DownArrowIcon.tsx";
import { UpArrowIcon } from "../../icons/UpArrowIcon.tsx";
import { useEffect, useState } from "react";
import { createSlug, formatter } from "./_utils";
import { THolding, Listing } from "@/app/types/types.ts";
import { useListingsStore } from "../store/listings.ts";
import { CloseIcon } from "@/app/icons/CloseIcon.tsx";

const parseDate = (dateString: string) => {
  let date = new Date(dateString);
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  return date;
};

export function Holding({
  label,
  scraper,
  showHidden,
  submittedBy,
}: {
  label: string;
  scraper: string;
  showHidden: boolean;
  submittedBy?: string;
}) {
  const { holding, listings, refreshHolding, setScraper } = useHoldingStore();
  const [filtered, setFiltered] = useState<any[]>([]);
  const refreshListings = useListingsStore((state) => state.refreshListings);
  const [showLinked, setShowLinked] = useState(false);
  const [showSubmittedBy, setShowSubmittedBy] = useState(false);
  const isSubmission = scraper === "submissions";

  useEffect(() => {
    setScraper(scraper);
    refreshHolding(scraper);

    // this logic needs to be cleaned up better. maybe use an audience prop?
    if (scraper === "submissions" && !submittedBy) {
      setShowLinked(true);
      setShowSubmittedBy(true);
    }
    if (scraper !== "submissions") {
      setShowLinked(true);
    }
  }, []);

  useEffect(() => {
    const result = holding.filter((item: THolding) => {
      const isListed = listings.find((l: Listing) => l.holdingId === item.id);

      if (submittedBy) {
        const isSubmittedBy = item.submittedBy === submittedBy;
        return isSubmittedBy && !isListed;
      }

      const isHidden = item.hidden === 1;
      return !isListed && isHidden === showHidden;
    });
    setFiltered(result);
  }, [holding, listings, showHidden]);

  return (
    <>
      <Table
        isKeyboardNavigationDisabled
        aria-label="Holding Table"
        topContent={
          <div className="flex justify-between items-center py-2">
            <h4 className="text-medium font-medium">{label}</h4>
            <p className="text-small text-default-500">
              {filtered.filter((item) => !item.hidden).length} records
            </p>
          </div>
        }
      >
        <TableHeader>
          <TableColumn width={"30%"}>ARTIST</TableColumn>
          <TableColumn>VENUE</TableColumn>
          <TableColumn>{showLinked && "LINKED"}</TableColumn>
          <TableColumn>{showSubmittedBy && "SUBMITTED BY"}</TableColumn>
          <TableColumn width={"100"}>TIME</TableColumn>
          <TableColumn width={"140"}>DATE</TableColumn>
          <TableColumn width={"50"}>TOOLS</TableColumn>
        </TableHeader>
        <TableBody>
          {filtered.map((item: THolding, index: number) => (
            <TableRow key={index}>
              <TableCell style={{ textTransform: "uppercase" }} className="p-0">
                <div className="flex w-full">
                  {item.hidden || isSubmission ? (
                    <div>{item.artist}</div>
                  ) : (
                    <Input
                      style={{ textTransform: "uppercase" }}
                      value={item.artist}
                      onChange={(e) => {
                        const updated = [...filtered];
                        updated[index] = {
                          ...updated[index],
                          artist: e.target.value,
                        };
                        setFiltered(updated);
                      }}
                      onBlur={(e) => {
                        updateHoldingArtist(
                          item.id,
                          (e.target as HTMLInputElement).value
                        );
                      }}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>{item.venue}</TableCell>
              <TableCell>
                {showLinked && (
                  <LinkVenue
                    holding={holding}
                    item={item}
                    label={
                      item.linkedVenueId
                        ? (item.linkedVenue ?? "")
                        : "Link Venue"
                    }
                    color={item.linkedVenueId ? "primary" : "default"}
                    onSuccess={() => {
                      refreshHolding(scraper);
                    }}
                    disabled={item.hidden ? true : false}
                    venue={item.venue || ""}
                  />
                )}
              </TableCell>
              <TableCell>
                {showLinked && <div>{item.linkedVenue ?? ""}</div>}
                {showSubmittedBy && (
                  <div>{item.submittedBy ? item.submittedBy : "Unknown"}</div>
                )}
              </TableCell>
              <TableCell>
                {formatter.format(new Date(`2000-01-01T${item.starttime}`))}
              </TableCell>
              <TableCell>
                {item.startdate
                  ? new Date(item.startdate).toDateString()
                  : "Invalid Date"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    onPress={async () => {
                      await deleteHolding(item.id);
                      refreshHolding(scraper);
                    }}
                  >
                    {item.hidden ? (
                      <UpArrowIcon size={16} filled={true} fill={"#ffffff"} />
                    ) : isSubmission ? (
                      <CloseIcon size={16} filled={true} fill={"#ffffff"} />
                    ) : (
                      <DownArrowIcon size={16} filled={true} fill={"#ffffff"} />
                    )}
                  </Button>
                  {item.linkedVenueId ? (
                    <Button
                      isIconOnly
                      size="sm"
                      color="success"
                      onPress={async () => {
                        await addListing({
                          name: item.artist ?? "",
                          slug: createSlug(
                            `${item.artist} ${item.venue} ${item.startdate}`
                          ),
                          starttime: item.starttime ?? "",
                          startdate: parseDate(item.startdate ?? ""),
                          url: "",
                          venueId: item.linkedVenueId ?? 0,
                          holdingId: item.id,
                        });
                        refreshHolding(scraper);
                        refreshListings();
                      }}
                    >
                      <UpArrowIcon size={16} filled={true} fill={"#000000"} />
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Spacer y={8} />
    </>
  );
}
