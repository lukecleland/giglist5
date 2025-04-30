"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spacer,
  Switch,
} from "@heroui/react";
import { DeleteListing } from "./DeleteListing.tsx";
import { useHoldingStore } from "@/app/gigtools/store/gigtools";
import { formatter } from "./_utils";
import { Listing } from "@/app/types/types.ts";
import { AddEditListing } from "./AddEditListing.tsx";
import { updateListing } from "../api/queries.tsx";

export function Listings() {
  const { holding, listings, refresh } = useHoldingStore();

  const getScraperFromListing = (listing: Listing) => {
    const matchedHolding = holding.find((h: any) => h.id === listing.holdingId);
    return matchedHolding?.scraper;
  };

  return (
    <>
      <h2>Giglist</h2>
      <Table aria-label="">
        <TableHeader>
          <TableColumn width={"30%"}>NAME</TableColumn>
          <TableColumn>LINKED VENUE</TableColumn>
          <TableColumn>PUBLISHED</TableColumn>
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
                <Switch
                  aria-label="Published"
                  defaultSelected={item.isPublished}
                  onChange={async (e) => {
                    const isChecked = e.target.checked;
                    updateListing({ ...item, isPublished: Number(isChecked) });
                  }}
                />
              </TableCell>
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
                  <AddEditListing id={item.id} />
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
