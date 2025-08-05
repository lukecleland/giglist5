// import { specialElite } from "@/config/fonts";
// import clsx from "clsx";
// import { Location } from "./location/Location";

// export default function Home() {
//   return (
//     <section
//       className={clsx(
//         specialElite.className,
//         "flex flex-col items-center justify-center gap-4 w-full min-h-screen -mt-20"
//       )}
//     >
//
//     </section>
//   );
// }

import "@/app/styles/main-section.css";
import { ListingDates } from "./gigs/components/ListingDates";

export default async function GigsPage() {
  return (
    <div className="w-full">
      <ListingDates />
    </div>
  );
}
