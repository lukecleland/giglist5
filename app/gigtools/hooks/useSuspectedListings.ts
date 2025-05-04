import { useMemo } from "react";
import { Listing } from "@/app/types/types";

export function useSuspectedListings(
  listings: Listing[],
  glListings: Listing[]
) {
  const suspectedIds = useMemo(() => {
    const glKeySet = new Set(
      glListings.map(l =>
        [l.startdate, l.starttime, l.venueId].join("|")
      )
    );

    return new Set(
      listings
        .filter(l =>
          glKeySet.has([l.startdate, l.starttime, l.venueId].join("|"))
        )
        .map(l => l.id)
    );
  }, [listings, glListings]);

  return suspectedIds;
}
