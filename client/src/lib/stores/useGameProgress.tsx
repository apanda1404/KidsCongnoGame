import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GameType = 'shapes' | 'counting' | 'colors';

interface GameProgressState {
  currentGame: GameType | null;
  progress: Record<GameType, number>;
  
  // Actions
  setCurrentGame: (game: GameType) => void;
  updateProgress: (game: GameType, level: number) => void;
  resetProgress: () => void;
}

export const useGameProgress = create<GameProgressState>()(
  persist(
    (set, get) => ({
      currentGame: null,
      progress: {
        shapes: 1,
        counting: 1,
        colors: 1
      },
      
      setCurrentGame: (game) => {
        set({ currentGame: game });
      },
      
      updateProgress: (game, level) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [game]: Math.max(level, state.progress[game])
          }
        }));
      },
      
      resetProgress: () => {
        set({
          progress: {
            shapes: 1,
            counting: 1,
            colors: 1
          }
        });
      }
    }),
    {
      name: 'kids-game-progress'
    }
  )
);
