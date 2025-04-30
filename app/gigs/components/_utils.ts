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
        datetime: new Date(date).toISOString(),
        listings,
    }));

    result.sort((a, b) => a.datestring.localeCompare(b.datestring));

    return result;
}

export function formatDateWithSuffix(dateStr: string) {
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  return formatted.replace(
    /\b(\d{1,2})(?=\b)/,
    (d) =>
      d +
      (["th", "st", "nd", "rd"][
        (((d as any) % 100) - 20) % 10 || (d as any) % 100
      ] || "th")
  );
}

export const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
});