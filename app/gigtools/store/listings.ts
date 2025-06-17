import { create } from "zustand";
import { getListings } from "@/app/gigtools/api/queries";
import { Listing } from "@/app/types/types";
import { bc } from "@/lib/broadcast";

interface ListingsState {
  listings: Listing[];
  fullListings: Listing[];
  refreshListings: () => Promise<void>;
  setListings: (listings: Listing[]) => void;
  searchListings: (query: string) => void;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  fullListings: [],
  refreshListings: async () => {
    const listings = (await getListings()) as Listing[];
    set({ listings: [...listings], fullListings: [...listings] });
    bc?.postMessage({ type: 'update', listings });
  },
  setListings: (listings: Listing[]) =>
    set({ listings: [...listings], fullListings: [...listings] }),
  searchListings: (query: string) => {
    const { fullListings } = get();
    const filtered = fullListings.filter((l) =>
      l.name.toLowerCase().includes(query.toLowerCase())
    );
    set({ listings: filtered });
  },
}));
