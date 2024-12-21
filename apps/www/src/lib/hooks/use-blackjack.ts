"use client";

import { create } from "zustand";
import type { BlackjackState } from "@blackjack/game/types";
import { io } from "socket.io-client";

export const useBlackjack = create<BlackjackState>((set, get) => ({
  socket: null,
  gameId: null,

  players: new Map(),
  currentPlayerId: null,
  
  // gameStatus: "WAITING_FOR_PLAYERS",
  // gameStartTimer: 0,
  
  // croupierCards: [],
  // deck: [],

  initializeSocket: (gameId: string, playerName: string) => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      query: { gameId, playerName }
    });
  
    socket.on("connect", () => {
      console.log("Socket connected");
      set({ 
        socket,
        gameId,
        currentPlayerId: socket.id
      });
      
      socket.emit("join-table", { 
        tableId: gameId, 
        playerName 
      }, (response: any) => {
        console.log("Join table response:", response);
      });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));