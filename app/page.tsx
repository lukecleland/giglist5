"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { subtitle } from "@/components/primitives";
import { Input } from "@heroui/input";
import { specialElite } from "@/config/fonts";
import clsx from "clsx";
import { Location } from "./location/Location";

export default function Home() {
  return (
    <section
      className={clsx(
        specialElite.className,
        "flex flex-col items-center justify-center gap-4 w-full min-h-screen -mt-20"
      )}
    >
      <Location />
    </section>
  );
}
