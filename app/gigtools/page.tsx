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
      <Link href="./gigtools/ingress/moshtix">
        <ScraperCard
          image="/images/moshtix.png"
          label="Moshtix"
          backgroundColor="#fff"
        />
      </Link>
      <Spacer x={8} />
      <Link href="./gigtools/ingress/oztix">
        <ScraperCard
          image="/images/oztix.png"
          label="Oztix"
          backgroundColor="#000"
        />
      </Link>
      <Spacer x={8} />
      <Link href="./gigtools/ingress/submissions">
        <ScraperCard
          image="./android-chrome-192x192.png"
          label="Submissions"
          backgroundColor="#fff"
        />
      </Link>
    </>
  );
}
