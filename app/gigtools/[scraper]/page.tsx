"use client";

import { Holding } from "../components/Holding.tsx";
import { Incoming } from "../components/Incoming.tsx";
import { Venues } from "../components/Venues.tsx";
import { Spacer } from "@heroui/react";
import { Listings } from "../components/Listings.tsx";
import * as Data from "../data/";
import { RefreshButton } from "@/app/gigtools/gigscraper/components/RefreshButton.tsx";
import { useRouter } from "next/router";

export type IncomingData = {
  artist: string;
  venue: string;
  starttime: string;
  startdate: string;
  originalArtist: string;
};

enum Scraper {
  Moshtix = "moshtix",
  Oztix = "oztix",
}

export default async function Page() {
  const router = useRouter();

  const scraper = router.query.scraper as Scraper;

  if (!scraper) {
    return <div>Scraper not found</div>;
  }

  const data: Record<string, IncomingData> = Data.default;

  return (
    <>
      <h1>Gigtools {scraper}</h1>
      <Spacer y={8} />
      <RefreshButton scraper={scraper as Scraper} />
      <Spacer y={8} />
      <Venues />
      <Listings />
      <Holding label="Holding" scraper={scraper} showHidden={false} />
      <Incoming scraper={scraper} data={data[scraper]} />
      <Holding label="Backlog" scraper={scraper} showHidden={true} />
    </>
  );
}
