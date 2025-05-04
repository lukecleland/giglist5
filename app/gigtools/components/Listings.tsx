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
import { DeleteListing } from "./DeleteListing";
import { useHoldingStore } from "@/app/gigtools/store/gigtools";
import { useListingsStore } from "@/app/gigtools/store/listings";
import { formatter } from "./_utils";
import { Listing } from "@/app/types/types";
import { AddEditListing } from "./AddEditListing";
import { updateListingPublished } from "../api/queries";
import { useSuspectedListings } from "../hooks/useSuspectedListings";

export function Listings() {
  const { holding, listings, refreshHolding, allListings } = useHoldingStore();
  const { refreshListings } = useListingsStore();
  const suspectedIds = useSuspectedListings(listings, allListings);

  const getScraperFromListing = (listing: Listing) => {
    const matchedHolding = holding.find((h: any) => h.id === listing.holdingId);
    return matchedHolding?.scraper;
  };

  console.log("suspectedIds", suspectedIds);

  return (
    <>
      <Table
        aria-label=""
        topContent={
          <div className="flex justify-between items-center py-2">
            <h4 className="text-medium font-medium">Listings</h4>
            <p className="text-small text-default-500">
              {listings.length} records
            </p>
          </div>
        }
      >
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
            <TableRow
              key={index}
              className={
                suspectedIds.has(item.id)
                  ? "bg-yellow-100 border-l-4 border-yellow-400"
                  : ""
              }
            >
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
                    await updateListingPublished(item.id, isChecked);
                    refreshListings();
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
                      if (scraper) refreshHolding(scraper);
                      refreshListings();
                    }}
                  />
                  <AddEditListing
                    id={item.id}
                    onSuccess={() => {
                      console.log("onSuccess");
                      refreshListings();
                    }} // Why isn't this working?
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
