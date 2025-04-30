"use server";

import { title } from "@/components/primitives";
import { Spacer } from "@heroui/react";
import { specialElite } from "@/config/fonts";
import { ScraperCard } from "./gigscraper/components/ScraperCard";
import clsx from "clsx";
import Link from "next/link";

export default async function GigtoolsPage() {
  return (
    <>
      <h1 className={clsx(title(), specialElite.className)}>Gigtools</h1>
      <Link href="./gigtools/moshtix">
        <ScraperCard image="/images/moshtix.png" label="Moshtix" />
      </Link>
      <Spacer x={8} />
      <Link href="./gigtools/oztix">
        <ScraperCard image="/images/oztix.png" label="Oztix" />
      </Link>
      <Spacer x={8} />
      <Link href="./gigtools/submissions">
        <ScraperCard image="" label="Submissions" />
      </Link>
    </>
  );
}
