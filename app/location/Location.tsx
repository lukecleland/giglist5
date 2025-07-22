"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { subtitle } from "@/components/primitives";
import { Input } from "@heroui/input";
import { ChangeEvent, useState } from "react";
import postcodeData from "./postcodes";

const raddii = [50, 20, 10, 5, 1];

const radiusOptions = raddii.map((radius) => ({
  key: radius,
  text: `${radius}km`,
  value: radius,
}));

interface PostcodeInfo {
  postcode: number;
  lat: number;
  long: number;
}

export const Location = () => {
  const [postcode, setPostcode] = useState<string>("0000");
  const [lat, setLat] = useState<number | null>(null);
  const [long, setLong] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(radiusOptions[0].value);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handlePostcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputPostcode = e.target.value;
    setPostcode(inputPostcode);

    const postcodeInfo: PostcodeInfo | undefined = postcodeData.find(
      (row: PostcodeInfo) => row.postcode === parseInt(inputPostcode)
    );

    if (postcodeInfo) {
      setLat(postcodeInfo.lat);
      setLong(postcodeInfo.long);
      setDisabled(false);
    } else {
      setLat(null);
      setLong(null);
      setDisabled(true);
    }
  };

  return (
    <>
      <div className="max-w-xl text-center justify-center">
        <div className={subtitle({ class: "mt-4" })}>Find local gigs</div>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Enter your post code" />
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          onClick={() => {
            handlePostcodeChange({
              target: { value: postcode },
            } as ChangeEvent<HTMLInputElement>);
          }}
        >
          Go!
        </Link>
      </div>
    </>
  );
};
