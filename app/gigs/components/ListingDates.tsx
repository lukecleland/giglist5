"use client";

import { Listing, ListingDate, ListingVenue, Venue } from "@/app/types/types";
import { ListingModal } from "./ListingModal";
import { useListingsStore } from "@/app/gigtools/store/listings";
import { useEffect } from "react";
import { pivotEvents, formatDateWithSuffix } from "./_utils";
import { specialElite } from "@/config/fonts";
import clsx from "clsx";

export function ListingDates() {
  const { listings, refresh } = useListingsStore();
  const listingDates = pivotEvents(listings as (Listing & Venue)[]);

  useEffect(() => {
    refresh();
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
