import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";
import type { ChipValue } from "@blackjack/game/types";

export const name = "add-bet";

type AddBetData = {
  tableId: string;
  amount: ChipValue;
};

export const execute: EventExecute<AddBetData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId, amount } = data;
  
  if (!tableId || amount <= 0) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.gameStatus !== "WAITING_FOR_BETS") {
    return callback({ success: false, error: "Cannot bet at this time" });
  }

  const player = table.players.find(p => p.id === socket.id);
  if (!player) {
    return callback({ success: false, error: "Player not found" });
  }

  if (player.balance < amount) {
    return callback({ success: false, error: "Insufficient balance" });
  }

  player.bets.push(amount);
  player.balance -= amount;
  player.status = "BETTING";

  io.to(tableId).emit("players-update", table.players);

  return callback({ 
    success: true,
    data: {
      bets: player.bets
    }
  });
};