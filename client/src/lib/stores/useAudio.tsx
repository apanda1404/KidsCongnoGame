import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  isPlaying: boolean;
  currentMusicTrack: number;
  musicTracks: string[];
  musicNames: string[];
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  switchMusicTrack: (trackIndex: number) => void;
  nextMusicTrack: () => void;
  getCurrentMusicName: () => string;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false, // Start unmuted for engaging experience
  isPlaying: false,
  currentMusicTrack: 0,
  musicTracks: [
    '/sounds/happy-kids.mp3',
    '/sounds/playful-bounce.mp3',
    '/sounds/learning-fun.mp3',
    '/sounds/cheerful-day.mp3',
    '/sounds/adventure-time.mp3',
    '/sounds/rainbow-melody.mp3'
  ],
  musicNames: [
    'Happy Kids',
    'Playful Bounce',
    'Learning Fun',
    'Cheerful Day',
    'Adventure Time',
    'Rainbow Melody'
  ],
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // Control background music based on mute state
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
        set({ isPlaying: false });
      } else {
        backgroundMusic.play().catch(() => {});
        set({ isPlaying: true });
      }
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  startBackgroundMusic: () => {
    const { backgroundMusic, isMuted } = get();
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(() => {
        console.log("Background music autoplay prevented - user interaction required");
      });
      set({ isPlaying: true });
    }
  },
  
  stopBackgroundMusic: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
      set({ isPlaying: false });
    }
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  switchMusicTrack: (trackIndex: number) => {
    const { musicTracks, isMuted } = get();
    if (trackIndex >= 0 && trackIndex < musicTracks.length) {
      const currentMusic = get().backgroundMusic;
      if (currentMusic) {
        currentMusic.pause();
      }
      
      const newMusic = new Audio(musicTracks[trackIndex]);
      newMusic.loop = true;
      newMusic.preload = 'auto';
      
      // Set consistent audio properties for all tracks
      newMusic.volume = 0.4;
      newMusic.playbackRate = 1.0;
      
      set({ 
        backgroundMusic: newMusic, 
        currentMusicTrack: trackIndex,
        isPlaying: false 
      });
      
      if (!isMuted) {
        newMusic.play().catch(() => {
          console.log("New music autoplay prevented");
        });
        set({ isPlaying: true });
      }
      
      console.log(`Switched to track ${trackIndex + 1}: ${get().musicNames[trackIndex]}`);
    }
  },
  
  nextMusicTrack: () => {
    const { currentMusicTrack, musicTracks } = get();
    const nextTrack = (currentMusicTrack + 1) % musicTracks.length;
    console.log(`Changing from track ${currentMusicTrack + 1} to track ${nextTrack + 1}`);
    get().switchMusicTrack(nextTrack);
  },
  
  getCurrentMusicName: () => {
    const { currentMusicTrack, musicNames } = get();
    return musicNames[currentMusicTrack] || 'Unknown Track';
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  }
}));
