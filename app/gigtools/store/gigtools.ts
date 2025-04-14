import { create } from "zustand";
import { selectHolding, getListingsByHoldingIds } from "@/app/gigtools/api/queries";

type HoldingItem = any; // you can replace this with a proper type
type ListingItem = any;

interface HoldingState {
  holding: HoldingItem[];
  listings: ListingItem[];
  refresh: (scraper: string) => Promise<void>;
}

export const useHoldingStore = create<HoldingState>((set) => ({
  holding: [],
  listings: [],
  refresh: async (scraper: string) => {
    const holding = (await selectHolding(scraper)) as HoldingItem[];
    const holdingIds = holding.map((item: HoldingItem) => item.id);
    const listings = (await getListingsByHoldingIds(holdingIds)) as ListingItem[];
    set({ holding, listings });
  },
}));
