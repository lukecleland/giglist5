import { Holding } from "../../components/Holding";
import { Submissions } from "../../components/Submissions";

export default function Page() {
  return (
    <>
      <Holding
        label="Submitted Gigs"
        scraper={"submissions"}
        showHidden={false}
      />
      <Submissions />
    </>
  );
}
