import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

export const name = "leave-table";

export const execute: EventExecute<void> = async (io: Server, socket: Socket, _, callback) => {
  for (const [tableId, table] of tables.entries()) {
    const playerIndex = table.players.findIndex(player => player.id === socket.id);
    
    if (playerIndex !== -1) {
      table.players.splice(playerIndex, 1);
      
      socket.leave(tableId);
      
      io.to(tableId).emit("players-update", table.players);
      console.log(`Player ${socket.id} left table ${tableId}`);

      return callback?.({ 
        success: true,
        data: {
          tableId
        } 
      });
    }
  }

  return callback?.({ 
    success: false, 
    error: "Player not found in any table" 
  });
};