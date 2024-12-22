"use client";

import { create } from "zustand";
import { io } from "socket.io-client";
import type { BlackjackState, EventResponse, GameStatus, TableDataCreatedResponse, TablePlayersUpdateResponse } from "@blackjack/game/types";

export const useBlackjack = create<BlackjackState>((set, get) => ({
  socket: null,
  tableId: null,
  players: [],
  dealerCards: [],

  gameStatus: "WAITING_FOR_PLAYERS",
  setGameStatus: (status: GameStatus) => {
    set({ gameStatus: status });
  },

  initializeSocket: (tableId: string, playerName: string) => {
    const { socket: existingSocket } = get();

    if (existingSocket) {
      existingSocket.disconnect();
      set({ socket: null, tableId: null, players: [] });
    }
  
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      query: { tableId, playerName }
    });
  
    socket.on("connect", () => {
      console.log("Socket connected");
      set({ socket, tableId });
      
      socket.emit("join-table", { tableId, playerName, playerId: socket.id }, (response: any) => {
        console.log("Join table response:", response);
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("players-update", (data: TablePlayersUpdateResponse) => {
      console.log("Players update received:", data.players);
      if (data.players) {
        console.log("Setting players:", data.players);
        set({ players: data.players });
      }
    });
    
    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, tableId: null, players: [] });
    }
  },

  createTable: (playerName: string) => {
    return new Promise((resolve, reject) => {
      const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);
      
      socket.on("connect", () => {
        socket.emit("create-table", { playerName, playerId: socket.id }, (response: EventResponse<TableDataCreatedResponse>) => {
          if (response.success && response.data?.tableId) {
            socket.disconnect();
            resolve(response.data.tableId);
          } else {
            socket.disconnect();
            reject(new Error("Failed to create table"));
          }
        });
      });

      socket.on("connect_error", () => {
        reject(new Error("Failed to connect to server"));
      });
    });
  }
}));