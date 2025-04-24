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

export function Holding({
  label,
  scraper,
  showHidden,
}: {
  label: string;
  scraper: string;
  showHidden: boolean;
}) {
  const { holding, listings, refresh } = useHoldingStore();
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    refresh(scraper);
  }, []);

  useEffect(() => {
    const result = holding.filter((item: THolding) => {
      const isListed = listings.find((l: Listing) => l.holdingId === item.id);
      const isHidden = item.hidden === 1;
      return !isListed && isHidden === showHidden;
    });
    setFiltered(result);
  }, [holding, listings, showHidden]);

  return (
    <>
      <h1>{label}</h1>
      <Spacer y={2} />
      <Table aria-label="">
        <TableHeader>
          <TableColumn width={"30%"}>ARTIST</TableColumn>
          <TableColumn>VENUE</TableColumn>
          <TableColumn>LINKED</TableColumn>
          <TableColumn width={"100"}>TIME</TableColumn>
          <TableColumn width={"140"}>DATE</TableColumn>
          <TableColumn width={"50"}>TOOLS</TableColumn>
        </TableHeader>
        <TableBody>
          {filtered.map((item: THolding, index: number) => (
            <TableRow key={index}>
              <TableCell style={{ textTransform: "uppercase" }}>
                <div className="flex w-full">
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
                </div>
              </TableCell>
              <TableCell>{item.venue}</TableCell>
              <TableCell>
                <LinkVenue
                  holding={holding}
                  item={item}
                  label={item.linkedVenueId ? item.linkedVenue : "Link Venue"}
                  color={item.linkedVenueId ? "primary" : "default"}
                  onSuccess={() => {
                    refresh(scraper);
                  }}
                />
              </TableCell>
              <TableCell>
                {formatter.format(new Date(`2000-01-01T${item.starttime}`))}
              </TableCell>
              <TableCell>{new Date(item.startdate).toDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    onPress={async () => {
                      await deleteHolding(item.id);
                      refresh(scraper);
                    }}
                  >
                    <DownArrowIcon size={16} filled={true} fill={"#ffffff"} />
                  </Button>
                  {item.linkedVenueId ? (
                    <Button
                      isIconOnly
                      size="sm"
                      color="success"
                      onPress={async () => {
                        await addListing({
                          description: "",
                          image: "",
                          name: item.artist,
                          slug: createSlug(
                            `${item.artist} ${item.venue} ${item.startdate}`
                          ),
                          starttime: item.starttime,
                          startdate: item.startdate,
                          url: "",
                          venueId: item.linkedVenueId,
                          holdingId: item.id,
                        });
                        refresh(scraper);
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
