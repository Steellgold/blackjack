import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

export const name = "remove-bet";

type RemoveBetData = {
  tableId: string;
};

export const execute: EventExecute<RemoveBetData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;
  
  if (!tableId) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.gameStatus !== "WAITING_FOR_BETS") {
    return callback({ success: false, error: "Cannot remove bet at this time" });
  }

  const player = table.players.find(p => p.id === socket.id);
  if (!player) {
    return callback({ success: false, error: "Player not found" });
  }

  if (player.bets.length === 0) {
    return callback({ success: false, error: "No bets to remove" });
  }

  const bet = player.bets.pop();
  player.balance += bet || 0;
  
  if (player.bets.length === 0) {
    player.status = "BETTING";
  }

  io.to(tableId).emit("players-update", table.players);

  return callback({ 
    success: true,
    data: {
      bets: player.bets
    }
  });
};