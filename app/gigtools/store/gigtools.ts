import { create } from "zustand";
import { selectHolding, getListingsByHoldingIds, getListings } from "@/app/gigtools/api/queries";
import { THolding, Listing } from "@/app/types/types";
import { bc } from "@/lib/broadcast";

interface HoldingState {
  holding: THolding[];
  listings: Listing[];
  allListings: Listing[];
  scraper: string;
  setScraper: (scraper: string) => void;
  refreshHolding: (scraper: string) => Promise<void>;
}

export const useHoldingStore = create<HoldingState>((set) => ({
  holding: [],
  listings: [],
  allListings: [],
  scraper: "",
  setScraper: (scraper: string) => set({ scraper }),
  refreshHolding: async (scraper: string) => {
    const holding = (await selectHolding(scraper)) as THolding[];
    const holdingIds = holding.map((item: THolding) => item.id);
    const listings = (await getListingsByHoldingIds(holdingIds)) as Listing[];
    const allListings = (await getListings()) as Listing[];
    set({ holding, listings });
    bc?.postMessage({ type: 'update', listings });
  },
}));
