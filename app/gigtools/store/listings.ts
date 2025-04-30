import { create } from "zustand";
import { getListings } from "@/app/gigtools/api/queries";
import { Listing } from "@/app/types/types";

interface ListingsState {
  listings: Listing[];
  refresh: () => Promise<void>;
}

export const useListingsStore = create<ListingsState>((set) => ({
  holding: [],
  listings: [],
  refresh: async () => {
    const listings = (await getListings()) as Listing[];
    set({ listings });
  },
}));
