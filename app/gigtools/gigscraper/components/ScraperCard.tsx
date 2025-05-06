"use client";

import { Card, CardFooter, Image } from "@heroui/react";
import React from "react";

export function ScraperCard({
  image,
  label,
  backgroundColor,
}: {
  image: string;
  label?: string;
  backgroundColor?: string;
}) {
  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image
        className="object-contain"
        height={200}
        src={image || " "}
        width={200}
        style={{
          backgroundColor: backgroundColor ? backgroundColor : "transparent",
        }}
      />
      <CardFooter>{label}</CardFooter>
    </Card>
  );
}
