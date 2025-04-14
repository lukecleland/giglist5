"use server";

import { Holding } from "../components/Holding.tsx";
import { Incoming } from "../components/Incoming.tsx";
import { Venues } from "../components/Venues.tsx";
import { selectHolding, selectVenues } from "../api/queries.tsx";
import { title } from "@/components/primitives";
import { Spacer } from "@heroui/react";
import { Special_Elite } from "next/font/google";
import { Listings } from "../components/Listings.tsx";
import * as Data from "../data/";
import clsx from "clsx";
import { RefreshButton } from "@/app/gigtools/gigscraper/components/RefreshButton.tsx";

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

const specialElite = Special_Elite({
  weight: ["400"],
  display: "swap",
});

export default async function Page({
  params,
}: {
  params: { scraper: string };
}) {
  const scraper = params?.scraper as Scraper;

  if (!scraper) {
    return <div>Scraper not found</div>;
  }

  const data: Record<string, IncomingData> = Data.default;
  const holding = await selectHolding(scraper as Scraper);

  return (
    <>
      <h1 className={clsx(title(), specialElite.className)}>
        Gigtools- {scraper}
      </h1>
      <Spacer y={8} />
      <RefreshButton scraper={scraper as Scraper} />
      <Spacer y={8} />
      <Venues />
      <Listings />
      <Holding label="Holding" scraper={scraper} showHidden={false} />
      <Incoming scraper={scraper} data={data[scraper]} holding={holding} />
      <Holding label="Backlog" scraper={scraper} showHidden={true} />
    </>
  );
}
