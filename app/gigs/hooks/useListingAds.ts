import { useEffect, useState } from "react";
import axios from "axios";
import { ListingAd } from "@/app/types/types";

const getPostcode = () => {
    const location = window.localStorage.getItem("location");
    let postcode = 0;
    if (location) {
        const locationObj = JSON.parse(location);
        postcode = parseInt(locationObj.postcode);
    }
    return postcode;
};

export const useListingAds = () => {
  const [listingAds, setListingAds] = useState<ListingAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchListingAds = async () => {
      try {
        const response = await axios.get(
          "https://api.baserow.io/api/database/rows/table/108866/?user_field_names=true",
          {
            headers: {
              Authorization: "Token oBtxXLOu03SJmaB8O8TNh3c8M6dbMobB",
            },
          }
        );

        const postcodeFirstChar = getPostcode().toString()[0];
        const validAds: ListingAd[] = response.data.results
          .filter((ad: ListingAd) => ad.Active)
          .filter((ad: ListingAd) => {
            const prefixes = ad.Postcode_Prefixes?.split(",") || [];
            return prefixes.includes(postcodeFirstChar) || prefixes.includes("0");
          });

        setListingAds(validAds);
      } catch (err: any) {
        console.error("Error fetching gig ads:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingAds();
  }, []);

  return { listingAds, isLoading, error };
};
