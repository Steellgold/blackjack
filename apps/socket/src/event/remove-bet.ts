import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

type JoinTableProps = {
  tableId: string;
}

export const name = "remove-bet";

export const execute: EventExecute<JoinTableProps> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;

  console.log(`Player ${socket.id} removing bet from table ${tableId}`); 
  const table = tables.get(tableId);

  if (!table) {
    callback({ success: false, error: "Table not found" });
    return;
  }

  const player = table.players.find((player) => player.id === socket.id);

  if (!player) {
    callback({ success: false, error: "Player not found" });
    return;
  }

  if (table.gameStatus !== "WAITING_FOR_BETS") {
    callback({ success: false, error: "Game is not waiting for bets" });
    return;
  }

  if (player.bets.length === 0) {
    table.players.forEach((player) => {
      if (player.id === socket.id) {
        player.status = "BETTING";
      }
    });
  }

  player.bets.pop();
  io.to(tableId).emit("table-data", table);
  return callback({ success: true });
};