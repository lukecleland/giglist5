import { create } from "zustand";
import { getListings } from "@/app/gigtools/api/queries";
import { Listing } from "@/app/types/types";
import { bc } from "@/lib/broadcast";

interface ListingsState {
  listings: Listing[];
  fullListings: Listing[];
  refreshListings: () => Promise<void>;
  setListings: (listings: Listing[]) => void;
}

export const useListingsStore = create<ListingsState>((set) => ({
  listings: [],
  fullListings: [],
  refreshListings: async () => {
    const listings = (await getListings()) as Listing[];
    set({ listings: [...listings] }); // ✅ ensure new array
    bc?.postMessage({ type: 'update', listings });
  },
  setListings: (listings: Listing[]) => set({ listings: [...listings] }), // ✅ same here
}));
