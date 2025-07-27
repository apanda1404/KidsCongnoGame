import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export default function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Load background music
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    setBackgroundMusic(backgroundMusic);

    // Load hit sound
    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.5;
    setHitSound(hitSound);

    // Load success sound
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.7;
    setSuccessSound(successSound);

    // Cleanup
    return () => {
      backgroundMusic.pause();
      backgroundMusic.src = '';
      hitSound.src = '';
      successSound.src = '';
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return null;
}
