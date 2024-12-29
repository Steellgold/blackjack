import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { MAX_PLAYERS, tables } from "../data";

export const name = "join-table";

type JoinTableData = {
  playerName: string;
  tableId: string;
};

export const execute: EventExecute<JoinTableData> = async (io: Server, socket: Socket, data, callback) => {
  const { playerName, tableId } = data;
  if (!playerName || !tableId) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.players.length >= MAX_PLAYERS) {
    return callback({ success: false, error: "Table is full" });
  }

  table.players.push({
    id: socket.id,
    name: playerName,
    cards: [],
    bets: [],
    status: "WAITING",
    balance: table.baseBalance
  });

  socket.join(tableId);
  io.to(tableId).emit("players-update", table.players);

  return callback({ 
    success: true,
    data: {
      tableId,
      state: table
    } 
  });
};