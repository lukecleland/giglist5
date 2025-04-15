import { DateList } from "./components/DateList";
import { TDate } from "@/app/types/types";
import { getListings } from "../gigtools/api/queries";

export default async function GigsPage() {
  const listings = await getListings();

  return (
    <div className="w-full">
      <div>
        <DateList dates={listings as TDate[]} />
      </div>
    </div>
  );
}
