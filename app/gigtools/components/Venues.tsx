"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spacer,
} from "@heroui/react";
import { useState } from "react";
import { SearchIcon } from "@/app/icons/SearchIcon";
import { searchVenue } from "@/app/gigtools/api/queries";
import { AddEditVenue } from "./AddEditVenue";

export const Venues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  async function searchVenues(term: string) {
    setSearchTerm(term);
    const res = await searchVenue(term);
    setSearchResults(JSON.parse(res));
  }

  return (
    <div>
      <h1>Venues</h1>
      <Spacer y={2} />
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[100%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            onChange={(e) => searchVenues(e.target.value)}
            isClearable
            onClear={() => {
              setSearchTerm("");
              setSearchResults([]);
            }}
          />
          <div className="flex gap-3">
            <AddEditVenue id={0} onSuccess={() => searchVenues(searchTerm)} />
          </div>
        </div>
      </div>
      {searchResults.length ? (
        <div className="flex flex-col gap-4">
          <Table aria-label="">
            <TableHeader>
              <TableColumn width={"30%"}>NAME</TableColumn>
              <TableColumn>ADDRESS</TableColumn>
              <TableColumn>SUBURB</TableColumn>
              <TableColumn width={"150"}>CITY</TableColumn>
              <TableColumn width={"50"}>POSTCODE</TableColumn>
              <TableColumn width={"100"}>TOOLS</TableColumn>
            </TableHeader>
            <TableBody>
              {searchResults.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.address1}</TableCell>
                  <TableCell>{item.suburb}</TableCell>
                  <TableCell>{item.city}</TableCell>
                  <TableCell>{item.postcode}</TableCell>
                  <TableCell>
                    <div
                      className="flex gap-2"
                      onClick={() => setSearchResults([])}
                    >
                      <AddEditVenue
                        id={item.id}
                        onSuccess={() => searchVenues(searchTerm)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Spacer y={8} />
        </div>
      ) : (
        <>
          <Spacer y={8} />
        </>
      )}
    </div>
  );
};
