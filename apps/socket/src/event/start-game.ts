import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { MAX_PLAYERS, tables } from "../data";
import { createDeck } from "@blackjack/game/utils";
import type { GameState } from "@blackjack/game/types";

export const name = "start-game";

type StartData = {
  tableId: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const distributeInitialCards = async (table: GameState, io: Server) => {
  const dealerCard1 = table.deck.pop();
  if (!dealerCard1 || !table.tableId) return; // No more cards (never happen but just in case)
  io.to(table.tableId).emit("deck-updated", table.deck);

  dealerCard1.owner = "DEALER";
  dealerCard1.isHidden = false;
  table.cards.push(dealerCard1);
  io.to(table.tableId).emit("card-distributed", { card: dealerCard1, recipient: "DEALER" });
  await sleep(1000);

  // First round of player cards
  for (const player of table.players) {
    const playerCard = table.deck.pop();
    if (!playerCard) return; // No more cards (never happen but just in case)
    io.to(table.tableId).emit("deck-updated", table.deck);

    playerCard.owner = "PLAYER";
    playerCard.isHidden = false;
    player.cards.push(playerCard);
    io.to(table.tableId).emit("card-distributed", { card: playerCard, recipient: player.id });
    await sleep(1000);
  }

  // Second dealer card (face down)
  const dealerCard2 = table.deck.pop();
  if (!dealerCard2) return; // No more cards (never happen but just in case)
  io.to(table.tableId).emit("deck-updated", table.deck);

  dealerCard2.owner = "DEALER";
  dealerCard2.isHidden = true;
  table.cards.push(dealerCard2);
  io.to(table.tableId).emit("card-distributed", { card: dealerCard2, recipient: "DEALER" });
  await sleep(1000);

  // Second round of player cards
  for (const player of table.players) {
    const playerCard = table.deck.pop();
    if (!playerCard) return; // No more cards (never happen but just in case)
    io.to(table.tableId).emit("deck-updated", table.deck);

    playerCard.owner = "PLAYER";
    playerCard.isHidden = false;
    player.cards.push(playerCard);
    io.to(table.tableId).emit("card-distributed", { card: playerCard, recipient: player.id });
    await sleep(1000);
  }
};

export const execute: EventExecute<StartData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;
  if (!tableId || !tableId) {
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

  table.gameStatus = "WAITING_FOR_BETS";
  io.to(tableId).emit("game-status-changed", table.gameStatus);

  table.bettingTimer = 10;
  io.to(tableId).emit("betting-timer", table.bettingTimer);

  const interval = setInterval(() => {
    table.bettingTimer--;
    io.to(tableId).emit("betting-timer", table.bettingTimer);

    if (table.bettingTimer <= 0) {
      table.players.forEach((player) => {
        if (player.bets.length === 0) player.status = "NOT_BETTED";
        else player.status = "BETTED";
      });

      clearInterval(interval);
      table.deck = createDeck();
      table.gameStatus = "WAITING_FOR_DISTRIBUTES";
      io.to(tableId).emit("game-status-changed", table.gameStatus);

      distributeInitialCards(table, io).then(() => {
        table.gameStatus = "WAITING_FOR_PLAYER_CHOICES";
        io.to(tableId).emit("game-status-changed", table.gameStatus);
      });
    }
  }, 1000);

  return callback({ 
    success: true,
    data: {
      tableId,
      deck: table.deck
    } 
  });
};