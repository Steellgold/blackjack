import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";
import type { GameState } from "@blackjack/game/types";
import { drawCard, getHandValue } from "@blackjack/game/utils";
import { sleep } from "../utils";

export const name = "action";

type ActionType = "HIT" | "STAND";

type ActionData = {
  tableId: string;
  action: ActionType;
};

const checkAllPlayersChosen = (io: Server, table: GameState) => {
  const tableId = table.tableId;
  if (!tableId) return;

  const allPlayersChosen = table.players.every(p => p.status !== "NOT_CHOSEN");
  if (allPlayersChosen) {
    const standingPlayers = table.players.filter(p => p.status === "STAND");
    const hittingPlayers = table.players.filter(p => p.status === "HIT");

    for (const player of hittingPlayers) {
      const card = drawCard(table.deck);
      if (!card) return; // No more cards (never happen but just in case)
      io.to(tableId).emit("deck-updated", table.deck);
      player.cards.push({ ...card, owner: "PLAYER", isHidden: false });
      io.to(tableId).emit("card-distributed", { card, recipient: player.id });

      const handValue = getHandValue(player.cards);
      if (handValue > 21) {
        player.status = "BUST";
      } else if (handValue === 21) {
        player.status = "STAND";
      } else {
        player.status = "NOT_CHOSEN";
      }

      sleep(1000);
      io.to(tableId).emit("players-update", table.players);
    }

    for (const player of standingPlayers) {
      player.status = "NOT_CHOSEN";
    }

    io.to(tableId).emit("players-update", table.players);
    io.to(tableId).emit("game-status-changed", "WAITING_FOR_PLAYER_CHOICES");
  }
};

export const execute: EventExecute<ActionData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId, action } = data;
  
  if (!tableId || !action) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.gameStatus !== "WAITING_FOR_PLAYER_CHOICES") {
    return callback({ success: false, error: `Cannot ${action.toLowerCase()} at this time` });
  }

  const player = table.players.find(p => p.id === socket.id);
  if (!player) {
    return callback({ success: false, error: "Player not found" });
  }

  if (action === "STAND") {
    player.status = "STAND";
  } else {
    player.status = "HIT";
  }

  io.to(tableId).emit("players-update", table.players);
  checkAllPlayersChosen(io, table);

  return callback({ success: true });
};