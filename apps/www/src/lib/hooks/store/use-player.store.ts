import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PlayerStore = {
  playerName: string;
  setPlayerName: (name: string) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      playerName: '',
      setPlayerName: (playerName: string) => set({ playerName }),
    }),
    {
      name: 'player-storage',
    }
  )
);