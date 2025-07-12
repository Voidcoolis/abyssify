import { axiosInstance } from "@/lib/axios";
import type { Album, Song } from "@/types"; //types folder
import { create } from "zustand";

interface MusicStore {
	songs: Song[]; // from the index.ts of the types folder
	albums: Album[];
	isLoading: boolean;
	error: string | null;
  currentAlbum: Album | null,

	fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
	
}

// this can be accessed everywhere
export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  
//* Fetches all albums from the API
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

  //* Fetches a specific album by ID
  fetchAlbumById: async(id) => {
    set({isLoading: true, error: null})

    try {
      const response = await axiosInstance.get(`/albums/${id}`)
      set({currentAlbum: response.data}); // Only updates currentAlbum. albums array remains unchanged
    } catch (error: any) {
      set({error: error.response.data.message}) //updating the state current album
    } finally {
      set({isLoading: false})
    }
  }
}));
