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
import { IncomingData } from "../[scraper]/page";
import { formatter } from "./_utils";

export function Incoming({
  scraper,
  data,
  holding,
}: {
  scraper: string;
  data: any;
  holding: any;
}) {
  const { refresh } = useHoldingStore();

  const dataNotAlreadyInHolding = data.filter((item: any) => {
    return !holding.find(
      (holdingItem: IncomingData) =>
        holdingItem.venue === item.venue &&
        holdingItem.starttime === item.starttime &&
        holdingItem.startdate === item.startdate &&
        holdingItem.originalArtist === item.artist
    );
  });

  return (
    <>
      <h4>Incoming</h4>
      <Spacer y={2} />
      <Table aria-label="">
        <TableHeader>
          <TableColumn width={"30%"}>ARTIST</TableColumn>
          <TableColumn>VENUE</TableColumn>
          <TableColumn>URL</TableColumn>
          <TableColumn width={"100"}>TIME</TableColumn>
          <TableColumn width={"140"}>DATE</TableColumn>
          <TableColumn width={"50"}>TOOLS</TableColumn>
        </TableHeader>
        <TableBody>
          {dataNotAlreadyInHolding.map((item: any, index: number) => (
            <TableRow key={index}>
              <TableCell style={{ textTransform: "uppercase" }}>
                {item.artist}
              </TableCell>
              <TableCell>{item.venue}</TableCell>
              <TableCell>
                <Link href={item.artisturl || ""} target="_blank">
                  Event Link
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
                        hidden: 1,
                        scraper: scraper,
                      });
                      refresh(scraper);
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
                        hidden: 0,
                        scraper: scraper,
                      });
                      refresh(scraper);
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
