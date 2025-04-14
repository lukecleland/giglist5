"use client";

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

import { DownArrowIcon } from "../../icons/DownArrowIcon.tsx";
import { UpArrowIcon } from "../../icons/UpArrowIcon.tsx";
import { DeleteListing } from "./DeleteListing.tsx";
import { useEffect, useState } from "react";
import { useHoldingStore } from "@/app/gigtools/store/gigtools";
import { formatter } from "./_utils";

export function Listings() {
  const { holding, listings, refresh } = useHoldingStore();

  const getScraperFromListing = (listing: any) => {
    const matchedHolding = holding.find((h: any) => h.id === listing.holdingId);
    return matchedHolding?.scraper;
  };

  return (
    <>
      <h1>Giglist</h1>
      <Spacer y={2} />
      <Table aria-label="">
        <TableHeader>
          <TableColumn width={"30%"}>NAME</TableColumn>
          <TableColumn>LINKED VENUE</TableColumn>
          <TableColumn width={"100"}>TIME</TableColumn>
          <TableColumn width={"140"}>DATE</TableColumn>
          <TableColumn width={"50"}>TOOLS</TableColumn>
        </TableHeader>
        <TableBody>
          {listings.map((item: any, index: number) => (
            <TableRow key={index}>
              <TableCell style={{ textTransform: "uppercase" }}>
                {item.name}
              </TableCell>
              <TableCell>{item.venueName}</TableCell>
              <TableCell>
                {formatter.format(new Date(`2000-01-01T${item.starttime}`))}
              </TableCell>
              <TableCell>{new Date(item.startdate).toDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <DeleteListing
                    listingId={item.id}
                    onDelete={() => {
                      const scraper = getScraperFromListing(item);
                      if (scraper) refresh(scraper);
                    }}
                  />
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
