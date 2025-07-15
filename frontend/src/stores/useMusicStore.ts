import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types"; //types folder
import { create } from "zustand";

interface MusicStore {
	songs: Song[]; // from the index.ts of the types folder
	albums: Album[];
	isLoading: boolean;
	error: string | null;
  currentAlbum: Album | null,
  featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
  stats: Stats;

	fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
}

// this can be accessed everywhere
export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
  stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},
  
fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},


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
  },

  fetchFeaturedSongs: async() => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get("/songs/featured")
      set({featuredSongs: response.data})
    } catch (error:any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchMadeForYouSongs: async () => {
    set({isLoading: true, error: null})

    try {
      const response = await axiosInstance.get("/songs/made-for-you")
      set({madeForYouSongs: response.data})
    } catch (error:any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchTrendingSongs: async () => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get("/songs/trending")
      set({trendingSongs: response.data})
    } catch (error: any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

}));
