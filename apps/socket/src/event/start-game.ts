import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

type JoinTableProps = {
  tableId: string;
}

export const name = "start-game";

export const execute: EventExecute<JoinTableProps> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;
  const table = tables.get(tableId);

  if (!table) {
    callback({ success: false, error: "Table not found" });
    return;
  }

  table.gameStatus = "WAITING_FOR_BETS";
  table.players.forEach((player) => {
    player.status = "BETTING";
  });

  io.to(tableId).emit("game-status-update", { gameStatus: table.gameStatus });
  io.to(tableId).emit("players-update", { players: table.players });

  return callback({ success: true, data: { table: table } });
};