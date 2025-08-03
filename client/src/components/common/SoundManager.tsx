import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export default function SoundManager() {
  const { setHitSound, setSuccessSound, switchMusicTrack } = useAudio();

  useEffect(() => {
    // Initialize with the first music track
    switchMusicTrack(0);

    // Load hit sound with better settings
    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.6;
    hitSound.preload = 'auto';
    setHitSound(hitSound);

    // Load success sound with better settings
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.8; // Louder for celebration
    successSound.preload = 'auto';
    setSuccessSound(successSound);

    // Cleanup
    return () => {
      // Cleanup handled by the audio store
    };
  }, [setHitSound, setSuccessSound, switchMusicTrack]);

  return null;
}
