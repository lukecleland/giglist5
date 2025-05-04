"use client";

import { Listing, ListingDate, ListingVenue, Venue } from "@/app/types/types";
import { ListingModal } from "./ListingModal";
import { useListingsStore } from "@/app/gigtools/store/listings";
import { useEffect, useMemo } from "react";
import { pivotEvents, formatDateWithSuffix } from "./_utils";
import { specialElite } from "@/config/fonts";
import clsx from "clsx";
import { bc } from "@/lib/broadcast";

export function ListingDates() {
  const listings = useListingsStore((state) => state.listings);
  const setListings = useListingsStore((state) => state.setListings);
  const refreshListings = useListingsStore((state) => state.refreshListings);

  const filteredListings = useMemo(
    () => listings.filter((listing: Listing) => listing.isPublished === 1),
    [listings]
  );

  const listingDates = useMemo(
    () => pivotEvents(filteredListings as (Listing & Venue)[]),
    [filteredListings]
  );

  useEffect(() => {
    if (!bc) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "update") {
        setListings(event.data.listings);
      }
    };

    bc.addEventListener("message", handleMessage);

    return () => {
      bc?.removeEventListener("message", handleMessage);
    };
  }, [setListings]);

  useEffect(() => {
    refreshListings();
  }, []);

  return (
    <ul>
      {listingDates.map((listingDate: ListingDate) => (
        <li key={listingDate.datetime} className="m-2">
          <div
            className={clsx(
              specialElite.className,
              "dark:bg-white dark:text-black light:bg-black light:text-white p-2 font-black"
            )}
          >
            {formatDateWithSuffix(listingDate.datestring)}
          </div>
          <ul>
            {listingDate.listings?.map(({ listing }: ListingVenue, index) => (
              <li key={`${listing.id}-${index}`}>
                <ListingModal listing={listing} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
