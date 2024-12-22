import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { MAX_PLAYERS, tables } from "../data";

export const name = "can-join-table";

type JoinTableData = {
  tableId: string;
};

export const execute: EventExecute<JoinTableData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;
  if (!tableId) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.players.length >= MAX_PLAYERS) {
    return callback({ success: false, error: "Table is full" });
  }

  if (table.gameStatus !== "WAITING_FOR_PLAYERS") {
    return callback({ success: false, error: "Game has already started" });
  }

  return callback({ 
    success: true,
    data: {
      tableId
    }
  });
};