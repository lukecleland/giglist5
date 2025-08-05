"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { subtitle } from "@/components/primitives";
import { Input } from "@heroui/input";
import { ChangeEvent, useEffect, useState } from "react";
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

  const handlePostcodeFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setPostcode("");
  };

  useEffect(() => {
    const location = window.localStorage.getItem("location");

    if (location) {
      const locationObj = JSON.parse(location);
      setPostcode(locationObj.postcode);
      setLat(locationObj.lat);
      setLong(locationObj.long);
      setRadius(100);
      setDisabled(false);
      window.location.href = "/gigs";
    }
  }, []);

  return (
    <>
      <div className="max-w-xl text-center justify-center">
        <div className={subtitle({ class: "mt-4" })}>Find local gigs</div>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Enter your post code"
          value={postcode}
          onChange={handlePostcodeChange}
          onFocus={handlePostcodeFocus}
          isInvalid={lat === null || long === null}
          errorMessage="Invalid postcode"
        />
        <Link
          isExternal
          isDisabled={disabled}
          className={buttonStyles({
            color: "primary",
            radius: "md",
            variant: "shadow",
          })}
          onClick={() => {
            window.localStorage.setItem(
              "location",
              JSON.stringify({
                postcode,
                lat,
                long,
                radius,
              })
            );
            window.location.href = "/gigs";
          }}
        >
          Go!
        </Link>
      </div>
    </>
  );
};
