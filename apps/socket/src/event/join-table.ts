import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";
import type { EventResponse } from "@blackjack/game/types";

type JoinTableProps = {
  tableId: string;
  playerName: string;
}

export const name = "join-table";

export const execute: EventExecute<JoinTableProps> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId, playerName } = data;
  
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
  if (!table) return callback({ success: false, error: "Table not found" });
  
  io.emit("can-join", { tableId, playerId: socket.id }, (response: EventResponse) => {
    if (!response.success) {
      return callback({ success: false, error: response.error });
    }

    console.log("Player can join table:", response);
  });

  table.players.push({
    id: socket.id,
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