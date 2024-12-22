import type { Card } from "./card.types";
import type { EventResponse, TableCreatedResponse, TableJoinableResponse, TableJoinedResponse } from "./responses.types";

export type GameStatus = 
  "WAITING_FOR_PLAYERS" | // Waiting for players to join - When OK: WAITING_FOR_BETS
  "WAITING_FOR_BETS" | // Players can place bets - When OK: WAITING_FOR_PLAYER_CHOICES
  "WAITING_FOR_PLAYER_CHOICES" | // Hit, Stand - When OK: WAITING_FOR_PLAYER_DEALER (if all players are done) dealer hits until 17
  "WAITING_FOR_DISTRIBUTES" | // Distributing initial cards - When OK: WAITING_FOR_PLAYER_CHOICES
  "WAITING_FOR_DEALER"; // Dealer is playing - When OK: WAITING_FOR_BETS

export type PlayerStatus = 
  "BETTING" | // Player is placing a bet
  "BETTED" | // Player has placed a bet
  "WAITING" | // Player is playing
  "NOT_BETTED" | // Player has not placed a bet and waiting for the next round
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
};

export type GameState = {
  tableId: string | null; // Table ID

  players: Player[]; // Players in the game

  gameStatus: GameStatus; // Current game status

  cards: Card[]; // Dealer's cards
  deck: Card[]; // Deck of cards

  bettingTimer: number; // Betting timer
};

export type BlackjackState = GameState & {
  canJoinTable: (tableId: string) => Promise<EventResponse<TableJoinableResponse>>; // Check if a player can join a table

  createTable: () => Promise<EventResponse<TableCreatedResponse>>; // Create a new table
  joinTable: (playerName: string, playerId: string) => Promise<EventResponse<TableJoinedResponse>>; // Join a table

  setGameStatus: (status: GameStatus) => void; // Set game status
};