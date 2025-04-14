"use client";

import { title } from "@/components/primitives";
import { useState, useEffect } from "react";
import { DateList } from "./components/DateList";
import { TDate } from "@/app/types/types";

function Giglist() {
  const [data, setData] = useState<TDate[] | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/giglist.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No giglist data</p>;

  return (
    <div>
      <DateList dates={data as TDate[]} />
    </div>
  );
}

export default function GigsPage() {
  return (
    <div className="w-full">
      <Giglist />
    </div>
  );
}
