"use client";

import { Card, CardFooter, Image } from "@heroui/react";
import React from "react";

export default function ScraperCard({
  image,
  label,
}: {
  image: string;
  label?: string;
}) {
  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image className="object-cover" height={200} src={image} width={200} />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        {label}
      </CardFooter>
    </Card>
  );
}
