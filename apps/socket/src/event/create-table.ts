import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

type CreateTableProps = {
  playerName: string;
}

export const name = "create-table";

export const execute: EventExecute<CreateTableProps> = async (io: Server, socket: Socket, data, callback) => {
  const { playerName } = data;
  if (!playerName) return callback({ success: false, error: "Invalid data" });

  const tableId = Math.random().toString(36).substring(7);

  if (tables.get(tableId)) {
    return callback({ success: false, error: "Table already exists" });
  }

  tables.set(tableId, {
    players: [],
    dealerCards: [],
    gameStatus: "WAITING_FOR_PLAYERS",
    socket: null,
    bettingTimer: 0,
    deck: [],
    tableId
  });

  socket.join(tableId);
  io.to(tableId).emit("players-update", { players: [] });

  console.log(`Table ${tableId} created by ${playerName} (${socket.id})`);

  return callback({ 
    success: true, 
    data: { tableId } 
  });
};