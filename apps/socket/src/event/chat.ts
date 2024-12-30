import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

export const name = "chat-message";

type ChatMessageData = {
  tableId: string;
  content: string;
};

export const execute: EventExecute<ChatMessageData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId, content } = data;
  
  if (!tableId || !content.trim()) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  const player = table.players.find(p => p.id === socket.id);
  if (!player) {
    return callback({ success: false, error: "Player not found" });
  }

  io.to(tableId).emit("chat-message-received", {
    content: content.slice(0, 200) + (content.length > 200 ? "..." : ""),
    sender: player.name,
    timestamp: new Date(),
    playerId: player.id,
    tableId
  });

  return callback({ 
    success: true
  });
};