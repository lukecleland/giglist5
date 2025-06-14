import { Listing, ListingDate, ListingVenue, Venue } from "@/app/types/types";

export function formatDateToYMD(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function pivotEvents(events: (Listing & Venue)[]): ListingDate[] {
    const map = new Map<string, ListingVenue[]>();

    for (const event of events) {
        const dateObj = new Date(event.startdate);
        const dateKey = formatDateToYMD(dateObj);

        if (!map.has(dateKey)) {
        map.set(dateKey, []);
        }
        map.get(dateKey)!.push({ listing: event });
    }

    const result: ListingDate[] = Array.from(map, ([date, listings]) => ({
        datestring: date,
        datetime: new Date(date),
        listings,
    }));

    result.sort((a, b) => a.datestring.localeCompare(b.datestring));

    return result;
}


export function formatDateWithSuffix(dateStr: string) {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();

  const getSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${weekday} ${month} ${day}${getSuffix(day)}`;
}




export const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
});