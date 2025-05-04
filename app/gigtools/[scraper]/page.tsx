"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IncomingData, IncomingGig, Scraper } from "@/app/types/types";
import { Incoming } from "../components/Incoming";
import { Spacer } from "@heroui/react";
import { RefreshButton } from "@/app/gigtools/gigscraper/components/RefreshButton";
import { Listings } from "../components/Listings";
import { Holding } from "../components/Holding";
import { Venues } from "../components/Venues";

export default function Page() {
  const { scraper } = useParams();
  const [data, setData] = useState<IncomingData | null>(null);

  useEffect(() => {
    fetch("/api/incoming")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to fetch incoming data:", err));
  }, []);

  if (!scraper || typeof scraper !== "string")
    return <div>Invalid scraper</div>;
  if (!data) return <div>Loading...</div>;

  const gigs: IncomingGig[] | undefined = data[scraper];

  if (!gigs) return <div>No data for scraper "{scraper}"</div>;

  return (
    <>
      <h1>Gigtools {scraper}</h1>
      <RefreshButton scraper={scraper as Scraper} />
      <Venues />
      <Listings />
      <Holding label="Holding" scraper={scraper} showHidden={false} />
      <Incoming scraper={scraper as Scraper} data={gigs} />
      <Holding label="Backlog" scraper={scraper} showHidden={true} />
    </>
  );
}
