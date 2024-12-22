import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

type CreateTableProps = {
  playerName: string;
  playerId: string;
}

export const name = "create-table";

export const execute: EventExecute<CreateTableProps> = async (io: Server, socket: Socket, data, callback) => {
  const { playerName, playerId } = data;
  if (!playerName || !playerId) return callback({ success: false, error: "Invalid data" });

  const tableId = Math.random().toString(36).substring(7);

  if (tables.get(tableId)) {
    return callback({ success: false, error: "Table already exists" });
  }

  tables.set(tableId, {
    players: [],
    dealerCards: [],
    gameStatus: "WAITING_FOR_PLAYERS",
    socket: null,
    tableId
  });

  socket.join(tableId);
  io.to(tableId).emit("players-update", { players: [] });

  console.log(`Table ${tableId} created by ${playerName} (${playerId})`);

  return callback({ 
    success: true, 
    data: { tableId } 
  });
};