import { ListingAd } from "@/app/types/types";
import "./ListingAds.css";

export const ListingAds = ({
  index,
  adId,
  listingAds,
}: {
  index: number;
  adId: number;
  listingAds: ListingAd[];
}) => {
  if (index === 0) return;

  const link =
    listingAds[adId] &&
    `${
      listingAds[adId].link
    }?utm_source=giglist.com.au&utm_medium=cpc&utm_campaign=${encodeURIComponent(
      listingAds[adId].Name
    )}`;
  return listingAds[adId] ? (
    <div className="advert">
      <a href={link} target="_blank" rel="noreferrer">
        <img src={listingAds[adId].image[0].url} alt="" />
      </a>
    </div>
  ) : (
    <></>
  );
};
