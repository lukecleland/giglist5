"use client";

import { Listing, ListingDate, ListingVenue, Venue } from "@/app/types/types";
import { ListingModal } from "./ListingModal";
import { useListingsStore } from "@/app/gigtools/store/listings";
import { useEffect, useMemo, useRef } from "react";
import { pivotEvents, formatDateWithSuffix } from "./_utils";
import { specialElite } from "@/config/fonts";
import clsx from "clsx";
import { bc } from "@/lib/broadcast";
import "./ListingDates.css";

export function ListingDates() {
  const listings = useListingsStore((state) => state.listings);
  const setListings = useListingsStore((state) => state.setListings);
  const refreshListings = useListingsStore((state) => state.refreshListings);
  const sectionRef = useRef<HTMLElement | null>(null);

  const filteredListings = useMemo(
    () => listings.filter((listing: Listing) => listing.isPublished === 1),
    [listings]
  );

  // This needs to be in the sync, and this will call from a static file along with listings
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

    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth > 600 && sectionRef.current) {
        event.preventDefault();
        sectionRef.current.scrollLeft += event.deltaY * 3; // adjust scroll speed
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full">
      {listingDates.map((listingDate: ListingDate, index) => (
        <div key={index} className="day">
          <div className="date labelmaker">
            {formatDateWithSuffix(listingDate.datestring)}
          </div>
          <ul>
            {listingDate.listings?.map(({ listing }: ListingVenue, index) => (
              <li key={`${listing.id}-${index}`}>
                <ListingModal listing={listing} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
