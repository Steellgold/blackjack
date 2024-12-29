import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import type { GameState, Card, GameStatus } from "@blackjack/game/types";
import { MAX_PLAYERS, tables } from "../data";
import { createDeck, drawCardWithReset } from "@blackjack/game/utils";
import { sleep } from "../utils";

export const name = "start-game";

type StartData = {
  tableId: string;
};

type CardDistribution = {
  owner: "PLAYER" | "DEALER";
  isHidden: boolean;
  recipient: string | "DEALER";
};

const DISTRIBUTION_SEQUENCE: CardDistribution[] = [
  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },  // First round players
  { owner: "DEALER", isHidden: false, recipient: "DEALER" },  // First dealer card
  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },  // Second round players
  { owner: "DEALER", isHidden: true, recipient: "DEALER" },    // Second dealer card

  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },
  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },
  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },
  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },
  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },
  { owner: "PLAYER", isHidden: false, recipient: "PLAYER" },
];

const updateTableStatus = (io: Server, tableId: string, table: GameState, status: GameStatus) => {
  table.gameStatus = status;
  io.to(tableId).emit("game-status-changed", status);
};

const distributeCard = async (
  io: Server,
  tableId: string,
  table: GameState,
  distribution: CardDistribution,
  playerId?: string
) => {
  const result = drawCardWithReset(table.deck);
  if (result.deckReset) {
    io.to(tableId).emit("deck-updated", result.deck);
  }
  table.deck = result.deck;
  
  const card = result.card;
  if (!card) return false;

  card.owner = distribution.owner;
  card.isHidden = distribution.isHidden;

  if (distribution.owner === "DEALER") {
    table.cards.push(card);
    io.to(tableId).emit("card-distributed", { 
      card, 
      recipient: "DEALER" 
    });
  } else if (playerId) {
    const player = table.players.find(p => p.id === playerId);
    if (player) {
      player.cards.push(card);
      io.to(tableId).emit("card-distributed", { 
        card, 
        recipient: playerId 
      });
    }
  }

  await sleep(1000);
  return true;
};

const distributeInitialCards = async (table: GameState, io: Server) => {
  const tableId = table.tableId;
  if (!tableId) return;

  for (const distribution of DISTRIBUTION_SEQUENCE) {
    if (distribution.owner === "PLAYER") {
      for (const player of table.players) {
        if (!await distributeCard(io, tableId, table, distribution, player.id)) {
          return;
        }
      }
    } else {
      if (!await distributeCard(io, tableId, table, distribution)) {
        return;
      }
    }
  }
};

const startBettingPhase = (table: GameState, io: Server, tableId: string) => {
  table.bettingTimer = 10;
  io.to(tableId).emit("betting-timer", table.bettingTimer);

  const interval = setInterval(() => {
    table.bettingTimer--;
    io.to(tableId).emit("betting-timer", table.bettingTimer);

    if (table.bettingTimer <= 0) {
      clearInterval(interval);
      handleBettingComplete(table, io, tableId);
    }
  }, 1000);
};

const handleBettingComplete = async (table: GameState, io: Server, tableId: string) => {
  table.players.forEach(player => {
    player.status = player.bets.length === 0 ? "NOT_BETTED" : "BETTED";
  });

  if (table.deck.length < 20) {
    table.deck = createDeck();
  }

  updateTableStatus(io, tableId, table, "WAITING_FOR_DISTRIBUTES");
  await distributeInitialCards(table, io);
  
  table.players.forEach(player => player.status = "NOT_CHOSEN");
  updateTableStatus(io, tableId, table, "WAITING_FOR_PLAYER_CHOICES");
  io.to(tableId).emit("players-update", table.players);
};

export const execute: EventExecute<StartData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;
  if (!tableId) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.players.length > MAX_PLAYERS || table.players.length > table.expectedPlayers) {
    return callback({ success: false, error: "Too many players" });
  }

  if (table.players[0]?.id !== socket.id) {
    return callback({ success: false, error: "Only the host can start the game" });
  }

  updateTableStatus(io, tableId, table, "WAITING_FOR_BETS");

  table.deck = createDeck();
  io.to(tableId).emit("deck-updated", table.deck);

  startBettingPhase(table, io, tableId);

  return callback({ 
    success: true,
    data: {
      tableId,
      deck: table.deck
    } 
  });
};