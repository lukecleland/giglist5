"use server";

import { getListings } from "../gigtools/api/queries";
import { Listing, Venue } from "../types/types";
import { GigMap } from "./components/GigMap";
import { GigMap3d } from "./components/GigMap3d";

export default async function MapPage() {
  const gigs = (await getListings()) as (Listing & Venue)[];

  return (
    <div style={{ height: "100vh", width: "100%" }} className="min-h-screen">
      <GigMap3d gigs={gigs} />
    </div>
  );
}
