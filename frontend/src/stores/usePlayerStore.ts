import type { Song } from "@/types";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";

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

    // Get the socket instance from the chat store's current state
    // updates the activity of the current user on the chat activity on the right side
    const socket = useChatStore.getState().socket;
		if (socket.auth) { // Check if the socket has authentication data (user is authenticated)
			socket.emit("update_activity", {
				userId: socket.auth.userId, // Send the user's ID from socket authentication
				activity: `Playing ${song.title} by ${song.artist}`, // Create an activity message showing what music the user is playing
			});
		}

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

    // Broadcast activity
    const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

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

    // Broadcast appropriate activity status
    const currentSong = get().currentSong;
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

    set({ isPlaying: willStartPlaying });
  },

  //! Skips to the next song in the queue
  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1; //find the next index

    // Check if there's a next song available and if there is a next song to play, let's play it
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      // Broadcast new song
      const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

      // Update to next song
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true, // Auto-play when skipping forward
      });
    } else {
      //no next song to play - stop playback
      set({ isPlaying: false });

      // Broadcast idle status
      const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
    }
  },

  //! Goes back to the previous song in the queue
  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    // Check if there's a previous song available
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

       // Broadcast new song
      const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true, // Auto-play when skipping back
      });
    } else {
      set({ isPlaying: false }); // No previous song

      // Broadcast idle status
      const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
    }
  },
}));
