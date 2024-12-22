import type { Card } from "./card.types";
import type { Socket } from "socket.io-client";

export type GameStatus = 
  "WAITING_FOR_PLAYERS" | // Waiting for players to join - When OK: WAITING_FOR_BETS
  "WAITING_FOR_BETS" | // Players can place bets - When OK: WAITING_FOR_PLAYER_CHOICES
  "WAITING_FOR_PLAYER_CHOICES" | // Hit, Stand - When OK: WAITING_FOR_PLAYER_DEALER (if all players are done) dealer hits until 17
  "WAITING_FOR_DEALER"; // Dealer is playing - When OK: WAITING_FOR_BETS

export type PlayerStatus = 
  "BETTING" | // Player is placing a bet
  "BETTED" | // Player has placed a bet
  "WAITING" | // Player is playing
  "STAND" | // Player has chosen to stand
  "HIT" | // Player has chosen to hit
  "BUST" | // Player has busted
  "BLACKJACK"; // Player has blackjack

export type Player = {
  id: string; // Socket ID
  name: string; // Player name

  cards: Card[]; // Player's cards
  bets: number[]; // Player's bets (in [] to be can cancel easily)

  status: PlayerStatus;
  isTurn: boolean;
};

export type GameState = {
  socket: Socket | null; // Socket connection
  tableId: string | null; // Table ID

  players: Player[]; // Players in the game
  dealerCards: Card[]; // 1 card hidden & 1 card visible

  gameStatus: GameStatus; // Current game status
};

export type BlackjackState = GameState & {
  setGameStatus: (status: GameStatus) => void; // Set game status

  initializeSocket: (tableId: string, playerName: string) => void; // Initialize socket connection
  disconnectSocket: () => void; // Disconnect socket connection

  createTable: (playerName: string) => Promise<string>; // Create a new table

  addBet: (bet: number) => void; // Add a bet
  removeBet: () => void; // Remove the last bet

  hit: () => void; // Player hits
  stand: () => void; // Player stands

  startGame: () => void; // Start the game (switch to WAITING_FOR_BETS)
};