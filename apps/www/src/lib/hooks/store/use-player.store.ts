import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PlayerStore = {
  playerName: string;
  setPlayerName: (name: string) => void;

  id: string;
  setId: (id: string) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      playerName: "",
      setPlayerName: (playerName: string) => set({ playerName }),

      id: "",
      setId: (id: string) => set({ id }),
    }),
    { name: "player-storage", getStorage: () => localStorage }
  )
);