import type { Card } from "./card.types";
import type { ChipValue } from "./chip.types";
import type { EventResponse, TableCreatedResponse, TableJoinableResponse, TableJoinedResponse, TableStartResponse } from "./responses.types";

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
  "NOT_CHOSEN" | // Player has not chosen to hit or stand  
  "STAND" | // Player has chosen to stand
  "HIT" | // Player has chosen to hit
  "BUST" | // Player has busted
  "PUSH" | // Player has a push

  // TEMPORARY
  "WIN" | // Player has won
  "LOSE" | // Player has lost
  // TEMPORARY

  "BLACKJACK"; // Player has blackjack

export type Player = {
  id: string; // Socket ID
  name: string; // Player name

  cards: Card[]; // Player's cards

  bets: number[]; // Player's bets (in [] to be can cancel easily)
  balance: number; // Player's balance

  status: PlayerStatus;
};

export type ChatMessage = {
  content: string;
  sender: string;
  timestamp: Date;
  playerId: string;
  tableId: string;
};

export type UnreadMessage = {
  messageId: string;
  timestamp: Date;
};

export type GameState = {
  isSolo: boolean;
  expectedPlayers: number; // Expected number of players
  baseBalance: number; // Base balance for each player

  backToBetsTimer: number; // Back to bets timer

  tableId: string | null; // Table ID

  players: Player[]; // Players in the game
  id: string; // Game Hoster ID

  gameStatus: GameStatus; // Current game status

  cards: Card[]; // Dealer's cards
  deck: Card[]; // Deck of cards

  bettingTimer: number; // Betting timer
};

export type BlackjackState = GameState & {
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => Promise<void>;

  unreadMessages: UnreadMessage[];
  markMessagesAsRead: () => void;

  canJoinTable: (tableId: string) => Promise<EventResponse<TableJoinableResponse>>; // Check if a player can join a table

  createTable: (data: { expectedPlayers: number; baseBalance: number; }) => Promise<EventResponse<TableCreatedResponse>>; // Create a new table
  joinTable: (playerName: string, playerId: string) => Promise<EventResponse<TableJoinedResponse>>; // Join a table
  startGame: (tableId: string) => Promise<EventResponse<TableStartResponse>>; // Start the game

  setGameStatus: (status: GameStatus) => void; // Set game status

  addBet: (amount: ChipValue) => void; // Add a bet
  removeBet: () => void; // Remove the last bet

  hit: () => void; // Hit
  stand: () => void; // Stand
};