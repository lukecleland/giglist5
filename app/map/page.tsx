"use server";

import { getListings } from "../gigtools/api/queries";
import { Listing, Venue } from "../types/types";
import { GigMap } from "./components/GigMap";

export default async function MapPage() {
  const gigs = (await getListings()) as (Listing & Venue)[];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GigMap gigs={gigs} />
    </div>
  );
}
