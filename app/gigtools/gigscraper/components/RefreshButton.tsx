"use client";

import { useState } from "react";
import * as Scrapers from "@/app/gigtools/gigscraper/scrapers";
import { Button } from "@heroui/react";

export const RefreshButton = ({
  scraper,
}: {
  scraper: keyof typeof Scrapers;
}) => {
  const [data, setData] = useState<any>(null);

  const handleScrape = async () => {
    setData(await Scrapers[scraper]());
  };

  return (
    <>
      <Button color={data ? "success" : "danger"} onPress={handleScrape}>
        Refresh Data
      </Button>
    </>
  );
};
