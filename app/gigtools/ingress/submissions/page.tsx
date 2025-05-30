import { Holding } from "../../components/Holding";
import { Listings } from "../../components/Listings";
import { Submissions } from "../../components/Submissions";
import { Venues } from "../../components/Venues";

export default function Page() {
  return (
    <>
      <h1>Submissions</h1>
      <Venues />
      <Listings />
      <Holding
        label="Submitted Gigs"
        scraper={"submissions"}
        showHidden={false}
      />
      <Submissions />
    </>
  );
}
