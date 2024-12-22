import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

type JoinTableProps = {
  tableId: string;
}

export const name = "can-join";

export const execute: EventExecute<JoinTableProps> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;
  
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
  if (table.players.find(player => player.id === socket.id)) return callback({ success: false, error: "Player already joined" });
  if (table.players.length >= 5) return callback({ success: false, error: "Table is full" });
  if (table.gameStatus !== "WAITING_FOR_PLAYERS") return callback({ success: false, error: "Game already started" });

  return callback({ success: true });
};