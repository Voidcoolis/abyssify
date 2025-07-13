import type { Song } from "@/types";
import { create } from "zustand";

interface PlayerStore {
  // Current state properties
  currentSong: Song | null; // Currently playing song or null if nothing playing
  isPlaying: boolean; // Whether audio is currently playing
  queue: Song[]; //* List of songs in the playback queue
  currentIndex: number; //* Index of current song in the queue

  // Action methods
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1, // -1 indicates no song is selected

  //! Array of songs to initialize the queue with
  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0], //get the very first song
      currentIndex: get().currentIndex || -1 ? 0 : get().currentIndex,
    });
  },

  //!   Starts playing an album from a specific index
  //* @param songs - Array of songs in the album
  //* @param startIndex - Optional index to start from (default 0)
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return; // Don't proceed if no songs

    const song = songs[startIndex];

    // Update player state
    set({
      queue: songs, // Set the full album as queue
      currentSong: song, // Set the starting song
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  //! Sets the current song directly
  //* @param song - Song to play or null to stop playback
  setCurrentSong: (song: Song | null) => {
    if (!song) return; // Ignore null values

    //* Find the song in current queue or keep current index
    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    set({
      currentSong: song,
      isPlaying: true, // Auto-play when song is set
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  //! Toggles between play and pause states
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    set({ isPlaying: willStartPlaying });
  },

  //! Skips to the next song in the queue
  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1; //find the next index

    // Check if there's a next song available and if there is a next song to play, let's play it
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      // Update to next song
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true, // Auto-play when skipping forward
      });
    } else {
      //no next song to play - stop playback
      set({ isPlaying: false });
    }
  },

  //! Goes back to the previous song in the queue
  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    // Check if there's a previous song available
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true, // Auto-play when skipping back
      });
    } else {
      set({ isPlaying: false }); // No previous song
    }
  },
}));
