"use client";

import { create } from "zustand";
import { io } from "socket.io-client";
import type { BettingTimerTickResponse, BlackjackState, EventResponse, GameState, GameStatus, TableDataCreatedResponse, TablePlayersUpdateResponse } from "@blackjack/game/types";

export const useBlackjack = create<BlackjackState>((set, get) => ({
  socket: null,
  tableId: null,
  players: [],
  dealerCards: [],
  bettingTimer: 0,
  
  deck: [],

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

    // socket.on("disconnect", () => {
    //   console.log("Socket disconnected");
    // });

    // socket.on("table-data", (data: EventResponse<TableDataCreatedResponse>) => {
    //   console.log("Table data received:", data);
    // });

    socket.on("betting-timer", (data: EventResponse<BettingTimerTickResponse>) => {
      console.log("Betting timer update:", data);
      if (data.data?.timeLeft) {
        set({ bettingTimer: data.data.timeLeft });
      }
    });

    socket.on("players-update", (data: EventResponse<TablePlayersUpdateResponse>) => {
      console.log("Players update received:", data.data?.players);
      if (data.data?.players) {
        console.log("Setting players:", data.data.players);
        set({ players: data.data.players });
      }
    });

    socket.on("game-status-update", (data: EventResponse<{ gameStatus: GameStatus }>) => {
      console.log("Game status update:", data);
      if (data.data?.gameStatus) {
        set({ gameStatus: data.data.gameStatus });
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
  },

  startGame: () => {
    const { socket, tableId } = get();
    if (socket && tableId) {
      socket.emit("start-game", { tableId }, (response: EventResponse<{ table: GameState }>) => {
        if (response.success) {
          console.log("Game started", response);
          if (response.data?.table) set({
            ...response.data?.table,
            socket: get().socket,
          });
        } else {
          console.error("Failed to start game:", response.error);
        }
      });
    }
  },

  addBet: (bet: number) => {
    const { socket, tableId } = get();
    console.log("Trying to add bet:", bet, socket, tableId);

    if (socket && tableId) {
      console.log("Adding bet:", bet);
      socket.emit("add-bet", { tableId, bet }, (response: EventResponse) => {
        if (!response.success) {
          console.error("Failed to add bet:", response.error);
        }

        console.log("Bet added:", response);
        set({
          players: get().players.map((player) => {
            if (player.id === socket.id) {
              player.bets.push(bet);
            }
            return player;
          })
        })
      });
    }
  },

  removeBet: () => {
    const { socket, tableId } = get();
    console.log("Trying to remove bet:", socket, tableId);

    if (socket && tableId) {
      socket.emit("remove-bet", { tableId }, (response: EventResponse) => {
        if (!response.success) {
          console.error("Failed to remove bet:", response.error);
        }

        console.log("Bet removed:", response);
        set({
          players: get().players.map((player) => {
            if (player.id === socket.id) {
              player.bets.pop();
            }
            return player;
          })
        })
      });
    }
  },

  hit: () => {
    const { socket, tableId } = get();
    if (socket && tableId) {
      socket.emit("hit", { tableId, playerId: socket.id });
    }
  },

  stand: () => {
    const { socket, tableId } = get();
    if (socket && tableId) {
      socket.emit("stand", { tableId, playerId: socket.id });
    }
  }
}));