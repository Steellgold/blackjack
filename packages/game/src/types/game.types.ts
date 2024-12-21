import type { Card } from "./card.types";
import type { Socket } from "socket.io-client";

export type GameStatus = 
  | "WAITING_FOR_PLAYERS"  // Waiting for more players
  | "BALANCE_START"        // Initial state to set the balance
  | "BETTING"              // Betting phase
  | "PLAYING"              // The game is in progress
  | "DEALER_TURN"          // Dealer's turn
  | "PLAYER_BLACKJACK"     // A player has a blackjack
  | "DEALER_BLACKJACK"     // The dealer has a blackjack
  | "PLAYER_WIN"           // A player wins
  | "DEALER_WIN"           // The dealer wins
  | "PLAYER_BUST"          // A player has gone over 21
  | "DEALER_BUST"          // The dealer has gone over 21
  | "DOUBLE_BUST"          // Both the player and dealer went over 21
  | "DRAW"                 // A tie between the player and dealer
  | "GAME_OVER";           // The game is over and the winner is declared (Never used i think)

export type PlayerStatus = 
  | "WAITING"              // Waiting for the next round
  | "BETTING"              // Placing a bet
  | "PLAYING"              // Currently playing
  | "STAND"                // Chose to stand
  | "BUST";                // Exceeded 21

export type Player = {
  id: string;
  name: string;
  balance: number;
  bet: number;
  cards: Card[];
  status: PlayerStatus;
};

export type GameState = {
  players: Map<string, Player>;
  croupierCards: Card[];
  deck: Card[];
  gameStatus: GameStatus;
  timer: number;
  currentPlayerIndex: number;
  timerId?: ReturnType<typeof setTimeout> | null;
};

export type BlackjackState = {
  socket: Socket | null;
  gameId: string | null;
  players: Map<string, Player>;
  currentPlayerId: string | null;
  
  // gameStatus: GameStatus;
  // gameStartTimer: number;
  
  // croupierCards: Card[];
  // deck: Card[];

  // --- Socket actions ---
  initializeSocket: (gameId: string, playerName: string) => void;
  disconnectSocket: () => void;
  
  // --- Game actions ---
  // placeBet: (amount: number) => void;
  // hit: () => void;
  // stand: () => void;
  
  // --- Socket events ---
  // setGameStatus: (status: GameStatus) => void;
  // setGameStartTimer: (timer: number) => void;
  // updatePlayer: (playerId: string, playerData: Partial<Player>) => void;
  // setCroupierCards: (cards: Card[]) => void;
};