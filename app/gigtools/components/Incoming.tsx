"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spacer,
} from "@heroui/react";

import Link from "next/link";
import { useHoldingStore } from "@/app/gigtools/store/gigtools";
import { addToHolding } from "@/app/gigtools/api/queries";
import { UpArrowIcon } from "../../icons/UpArrowIcon";
import { DownArrowIcon } from "../../icons/DownArrowIcon";
import { formatter } from "./_utils";
import { IncomingGig, Scraper, THolding } from "@/app/types/types";

export function Incoming({
  scraper,
  data,
}: {
  scraper: Scraper;
  data: IncomingGig[];
}) {
  const { refreshHolding, holding } = useHoldingStore();

  if (!data) {
    return <div>No data</div>;
  }

  const dataNotAlreadyInHolding = data.filter((item: IncomingGig) => {
    return !holding.find(
      (holdingItem: THolding) =>
        holdingItem.venue === item.venue &&
        holdingItem.starttime === item.starttime &&
        holdingItem.startdate === item.startdate &&
        holdingItem.originalArtist === item.artist
    );
  });

  return (
    <>
      <Table
        isKeyboardNavigationDisabled
        aria-label="Incoming Gigs Table"
        topContent={
          <div className="flex justify-between items-center py-2">
            <h4 className="text-medium font-medium">Incoming</h4>
            <p className="text-small text-default-500">
              {dataNotAlreadyInHolding.length} records
            </p>
          </div>
        }
      >
        <TableHeader>
          <TableColumn width={"30%"}>ARTIST</TableColumn>
          <TableColumn>VENUE</TableColumn>
          <TableColumn>URL</TableColumn>
          <TableColumn width={"100"}>TIME</TableColumn>
          <TableColumn width={"140"}>DATE</TableColumn>
          <TableColumn width={"50"}>TOOLS</TableColumn>
        </TableHeader>
        <TableBody>
          {dataNotAlreadyInHolding.map((item: IncomingGig, index: number) => (
            <TableRow key={index}>
              <TableCell style={{ textTransform: "uppercase" }}>
                {item.artist}
              </TableCell>
              <TableCell>{item.venue}</TableCell>
              <TableCell>
                <Link href={item.artisturl || ""} target="_blank">
                  {item.artisturl ? "Event Link" : "Invalid Link"}
                </Link>
              </TableCell>
              <TableCell>
                {formatter.format(new Date(`2000-01-01T${item.starttime}`))}
              </TableCell>
              <TableCell>{new Date(item.startdate).toDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    onPress={async () => {
                      await addToHolding({
                        ...item,
                        hidden: true,
                        scraper: scraper,
                      });
                      refreshHolding(scraper);
                    }}
                    color="danger"
                    size="sm"
                  >
                    <DownArrowIcon size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    onPress={async () => {
                      await addToHolding({
                        ...item,
                        hidden: false,
                        scraper: scraper,
                      });
                      refreshHolding(scraper);
                    }}
                    color="success"
                    size="sm"
                  >
                    <UpArrowIcon size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Spacer y={8} />
    </>
  );
}
