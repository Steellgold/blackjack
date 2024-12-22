import type { Server, Socket } from "socket.io";
import { tables } from "../data";

export const name = "disconnect";

export const execute = (io: Server, socket: Socket) => {
  const tableIds = Array.from(socket.rooms);
  
  tableIds.forEach(tableId => {
    if (tableId === socket.id) return;
    
    const table = tables.get(tableId);
    if (!table) return;

    table.players.forEach((player, index) => {
      if (player.id === socket.id) {
        table.players.splice(index, 1);
      }
    });

    io.to(tableId).emit("players-update", {
      players: table.players
    });

    console.log(`Player ${socket.id} disconnected from table ${tableId}`);

    if (table.players.length === 0) {
      tables.delete(tableId);
      console.log(`Table ${tableId} deleted`);
    }

    socket.leave(tableId);
  });
};