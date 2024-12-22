import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

type JoinTableProps = {
  tableId: string;
  playerName: string;
  playerId: string;
}

export const name = "join-table";

export const execute: EventExecute<JoinTableProps> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId, playerName, playerId } = data;
  
  let table = tables.get(tableId);
  
  if (!table) {
    tables.set(tableId, {
      dealerCards: [],
      gameStatus: "WAITING_FOR_PLAYERS",
      players: [],
      socket: null,
      tableId,
      deck: [],
      bettingTimer: 0
    });
  }

  table = tables.get(tableId);

  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.players.find(player => player.id === playerId)) {
    return callback({ success: false, error: "Player already joined" });
  }

  table.players.push({
    id: playerId,
    name: playerName,
    cards: [],
    bets: [],
    status: "WAITING"
  });
  
  socket.join(tableId);

  io.to(tableId).emit("players-update", {
    players: table.players
  });

  return callback({ success: true });
};