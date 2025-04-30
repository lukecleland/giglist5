import { create } from "zustand";
import { selectHolding, getListingsByHoldingIds } from "@/app/gigtools/api/queries";
import { THolding, Listing } from "@/app/types/types";

interface HoldingState {
  holding: THolding[];
  listings: Listing[];
  refresh: (scraper: string) => Promise<void>;
}

export const useHoldingStore = create<HoldingState>((set) => ({
  holding: [],
  listings: [],
  refresh: async (scraper: string) => {
    const holding = (await selectHolding(scraper)) as THolding[];
    const holdingIds = holding.map((item: THolding) => item.id);
    const listings = (await getListingsByHoldingIds(holdingIds)) as Listing[];
    set({ holding, listings });
  },
}));
