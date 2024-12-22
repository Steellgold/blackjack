"use client";

import type { BlackjackState, Card, EventResponse, GameStatus, Player, TableCreatedResponse, TableJoinableResponse, TableJoinedResponse } from "@blackjack/game/types";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { Component } from "../components/utils/component";

const BlackjackContext = createContext<BlackjackState | null>(null);

export const useBlackjack = () => {
  const context = useContext(BlackjackContext);
  if (!context) {
    throw new Error("useBlackjack must be used within a BlackjackProvider");
  }
  return context;
};

export const BlackjackProvider: Component<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [tableId, setTableId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [expectedPlayers, setExpectedPlayers] = useState<number>(0);
  
  const [cards, setCards] = useState<Card[]>([]); // Dealer's cards
  const [deck, setDeck] = useState<Card[]>([]); // Deck of cards
  
  const [gameStatus, setGameStatus] = useState<GameStatus>("WAITING_FOR_PLAYERS");
  const [bettingTimer, setBettingTimer] = useState<number>(0);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    console.log("Setting up socket listeners...");

    socket.on("connect", () => {
      console.log("Socket connected: ", socket.id);
    });
  
    socket.on("error", (err) => {
      console.error("Socket error: ", err);
    });
  
    socket.on("players-update", (players) => {
      console.log("Players update event received:", players);
      setPlayers(players);
    });  

    // Ajoutez un listener pour tous les événements (debug uniquement)
    socket.onAny((eventName, ...args) => {
      console.log("Received event:", eventName, args);
    });

    return () => {
      socket.off("connect");
      socket.off("players-update");
      socket.off("error");
    };
  }, [socket]);

  const createTable = async () => {
    return new Promise<EventResponse<TableCreatedResponse>>((resolve, reject) => {
      socket?.emit("create-table", {}, (data: EventResponse<TableCreatedResponse>) => {
        if (data.success && data.data) {
          setTableId(data.data.tableId);
          console.log("Table created:", data.data.tableId);
          resolve(data);
        } else {
          console.error("Failed to create table:", data);
          reject(data);
        }
      });
    });
  };

  const joinTable = async (playerName: string, tableId: string) => {
    return new Promise<EventResponse<TableJoinedResponse>>((resolve, reject) => {
      if (!tableId) {
        resolve({ success: false, error: "Table ID is missing" });
        return;
      }

      socket?.emit("join-table", { playerName, tableId }, (data: EventResponse<TableJoinedResponse>) => {
        if (data.success && data.data) {
          setTableId(data.data.tableId);
          console.log("Table joined:", data.data.tableId);
          resolve(data);
        } else {
          resolve(data);
        }
      });
    });
  };

  const canJoinTable = (tableId: string) => {
    return new Promise<EventResponse<TableJoinableResponse>>((resolve, reject) => {
      if (!tableId) {
        resolve({ success: false, error: "Table ID is missing" });
        return;
      }

      socket?.emit("can-join-table", { tableId }, (data: EventResponse<TableJoinableResponse>) => {
        resolve(data);
        // if (data.success) {
        //   resolve(data);
        // } else {
        //   reject(data);
        // }
      });
    });
  };

  const value: BlackjackState = {
    isSolo: false, // TODO: Implement single player mode (Just auto-launch the process when the player joins)
    expectedPlayers,

    canJoinTable,

    createTable,
    joinTable,
    tableId,
    
    players,
    
    gameStatus,
    setGameStatus,

    bettingTimer,

    cards,
    deck,
  };

  return (
    <BlackjackContext.Provider value={value}>
      {children}
    </BlackjackContext.Provider>
  );
};