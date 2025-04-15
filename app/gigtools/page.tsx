"use server";

import { title } from "@/components/primitives";
import { Spacer } from "@heroui/react";
import { Special_Elite } from "next/font/google";
import clsx from "clsx";

import Link from "next/link";
import ScraperCard from "./gigscraper/components/ScraperCard";

const specialElite = Special_Elite({
  weight: ["400"],
  display: "swap",
});

export default async function GigtoolsPage() {
  return (
    <>
      <h1 className={clsx(title(), specialElite.className)}>Gigtools</h1>
      <Spacer y={8} />
      <Link href="./gigtools/moshtix">
        <ScraperCard image="/images/moshtix.png" label="Moshtix" />
      </Link>
      <Link href="./gigtools/oztix">
        <ScraperCard image="/images/oztix.png" label="Oztix" />
      </Link>
      <Spacer y={8} />
    </>
  );
}
