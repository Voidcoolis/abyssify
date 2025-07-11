import { axiosInstance } from "@/lib/axios";
import type { Album, Song } from "@/types"; //types folder
import { create } from "zustand";

interface MusicStore {
	songs: Song[]; // from the index.ts of the types folder
	albums: Album[];
	isLoading: boolean;
	error: string | null;

	fetchAlbums: () => Promise<void>;
	
}

// this can be accessed everywhere
export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  

  fetchAlbums: async () => {
    //data fatching logic...
    set({
      isLoading: true,
      error: null,
    });

    try {
        const response = await axiosInstance.get("/albums");
        set({albums: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
        set({ isLoading: false });
    }
  },
}));
