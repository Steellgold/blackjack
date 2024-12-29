"use client";

import type { TableStartResponse, BlackjackState, Card, EventResponse, GameStatus, Player, TableCreatedResponse, TableJoinableResponse, TableJoinedResponse, ChipValue, TableBetResponse } from "@blackjack/game/types";
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
  const [baseBalance, setBaseBalance] = useState<number>(0);
  
  const [cards, setCards] = useState<Card[]>([]); // Dealer's cards
  const [deck, setDeck] = useState<Card[]>([]); // Deck of cards
  
  const [gameStatus, setGameStatus] = useState<GameStatus>("WAITING_FOR_PLAYERS");
  const [bettingTimer, setBettingTimer] = useState<number>(0);
  const [backToBetsTimer, setBackToBetsTimer] = useState<number>(0);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://socket.blackjack.steellgold.fr");
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
      setPlayers(players);
    });  

    socket.on("deck-updated", (deck: Card[]) => {
      setDeck(deck);
    });

    socket.on("betting-timer", (timer: number) => {
      setBettingTimer(timer);
    });

    socket.on("back-to-bets-timer", (timer: number) => {
      setBackToBetsTimer(timer);
    });

    socket.on("card-distributed", ({ card, recipient }) => {
      if (recipient === "DEALER") {
        setCards(prevCards => [...prevCards, card]);
      } else {
        setPlayers(prevPlayers => 
          prevPlayers.map(player => 
            player.id === recipient 
              ? { ...player, cards: [...player.cards, card] }
              : player
          )
        );
      }
    });

    socket.on("ended", (tableId) => {
      setCards([]);
      setPlayers(prevPlayers => 
        prevPlayers.map(player => 
          ({ ...player, cards: [], status: "NOT_BETTED" })
        )
      );

      socket.emit("start-game", { tableId }, (data: EventResponse<TableStartResponse>) => {});
    });

    socket.on("cards-updated", ({ cards, recipient }) => {
      if (recipient === "DEALER") {
        setCards(cards);
      } else {
        setPlayers(prevPlayers => 
          prevPlayers.map(player => 
            player.id === recipient 
              ? { ...player, cards }
              : player
          )
        );
      }
    });

    socket.on("game-status-changed", (status) => {
      console.log("Game status:", gameStatus);
      console.log("Game status received:", status);
      setGameStatus(status);
      console.log("Game status set:", gameStatus);
    });

    return () => {
      socket.off("connect");
      socket.off("players-update");
      socket.off("error");
    };
  }, [socket]);

  const createTable = async (createData: { expectedPlayers: number, baseBalance: number }) => {
    return new Promise<EventResponse<TableCreatedResponse>>((resolve, reject) => {
      socket?.emit("create-table", {
        expectedPlayers: createData.expectedPlayers,
        baseBalance: createData.baseBalance
      }, (data: EventResponse<TableCreatedResponse>) => {
        if (data.success && data.data) {
          setTableId(data.data.tableId);
          setExpectedPlayers(createData.expectedPlayers);
          setBaseBalance(createData.baseBalance);
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
          setPlayers(data.data.state.players);
          setGameStatus(data.data.state.gameStatus);
          setCards(data.data.state.cards);
          setDeck(data.data.state.deck);
          setBettingTimer(data.data.state.bettingTimer);
          setExpectedPlayers(data.data.state.expectedPlayers);
          setBaseBalance(data.data.state.baseBalance);
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

      socket?.emit("can-join-table", { tableId }, (data: EventResponse<TableJoinableResponse>) => resolve(data));
    });
  };

  const startGame = (tableId: string) => {
    return new Promise<EventResponse<TableStartResponse>>((resolve, reject) => {
      if (!tableId) {
        resolve({ success: false, error: "Table ID is missing" });
        return;
      }

      socket?.emit("start-game", { tableId }, (data: EventResponse<TableStartResponse>) => {
        if (data.success && data.data) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  };

  const addBet = (amount: ChipValue) => {
    return new Promise<EventResponse<TableBetResponse>>((resolve, reject) => {
      if (!tableId || !socket) {
        reject({ success: false, error: "No table or socket connection" });
        return;
      }
  
      socket.emit("add-bet", { tableId, amount }, (response: EventResponse<TableBetResponse>) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  };
  
  const removeBet = () => {
    return new Promise<EventResponse<TableBetResponse>>((resolve, reject) => {
      if (!tableId || !socket) {
        reject({ success: false, error: "No table or socket connection" });
        return;
      }
  
      socket.emit("remove-bet", { tableId }, (response: EventResponse<TableBetResponse>) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  };

  const hit = async () => {
    return new Promise<EventResponse<void>>((resolve, reject) => {
      if (!tableId || !socket) {
        reject({ success: false, error: "No table or socket connection" });
        return;
      }
  
      socket.emit("action", { 
        tableId, 
        action: "HIT" 
      }, (response: EventResponse<void>) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  };
  
  const stand = async () => {
    return new Promise<EventResponse<void>>((resolve, reject) => {
      if (!tableId || !socket) {
        reject({ success: false, error: "No table or socket connection" });
        return;
      }
  
      socket.emit("action", { 
        tableId, 
        action: "STAND" 
      }, (response: EventResponse<void>) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  };

  const value: BlackjackState = {
    isSolo: false, // TODO: Implement single player mode (Just auto-launch the process when the player joins)
    id: socket?.id ?? "", // Socket ID

    expectedPlayers,
    baseBalance,

    canJoinTable,

    createTable,
    joinTable,
    startGame,
    tableId,
    
    players,
    
    gameStatus,
    setGameStatus,

    bettingTimer,
    backToBetsTimer,
    addBet,
    removeBet,

    cards,
    deck,

    hit,
    stand
  };

  return (
    <BlackjackContext.Provider value={value}>
      {children}
    </BlackjackContext.Provider>
  );
};