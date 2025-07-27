import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export default function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, startBackgroundMusic } = useAudio();

  useEffect(() => {
    // Load background music with more engaging settings
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.4; // Slightly louder for engagement
    backgroundMusic.preload = 'auto';
    
    // Add event listeners for better control
    backgroundMusic.addEventListener('canplaythrough', () => {
      console.log('Background music is ready to play');
    });
    
    backgroundMusic.addEventListener('error', (e) => {
      console.log('Background music failed to load:', e);
    });
    
    setBackgroundMusic(backgroundMusic);

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

    // Start background music after a short delay (better for engagement)
    const musicTimer = setTimeout(() => {
      startBackgroundMusic();
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(musicTimer);
      backgroundMusic.pause();
      backgroundMusic.src = '';
      hitSound.src = '';
      successSound.src = '';
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound, startBackgroundMusic]);

  return null;
}
