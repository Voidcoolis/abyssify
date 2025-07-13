import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react"

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null); // Gives direct access to the native HTML5 audio element - see notes.md for more
    const prevSongRef = useRef<string | null>(null); // Remembers the last played song to avoid unnecessary reloads

    const { currentSong, isPlaying, playNext } = usePlayerStore();

   //handle play/pause logic
   useEffect(() => {
       if (isPlaying) {
        audioRef.current?.play();
       } else {
        audioRef.current?.pause();
       }
   }, [isPlaying]);

   // handle song ends
	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			playNext(); // Auto-play next song when current ends
		};

		audio?.addEventListener("ended", handleEnded);

		return () => audio?.removeEventListener("ended", handleEnded); // Cleanup removes the listener when component unmounts
	}, [playNext]);

    // handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		//* Checks if the song actually changed (by comparing audio URLs)
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		if (isSongChange) {
			audio.src = currentSong?.audioUrl; // Set new source
			audio.currentTime = 0; // Reset playback position

			prevSongRef.current = currentSong?.audioUrl; // Update tracker

			if (isPlaying) audio.play(); // Auto-play if in playing state
		}
	}, [currentSong, isPlaying]);

  return (
    <audio ref={audioRef} />
  )
}

export default AudioPlayer