import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

export const name = "create-table";

export const execute: EventExecute = async (io: Server, socket: Socket, data, callback) => {
  const tableId = "abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWYZ1234567890".split("").sort(() => 0.5 - Math.random()).slice(0, 4).join("");

  tables.set(tableId, {
    players: [],
    gameStatus: "WAITING_FOR_PLAYERS",
    bettingTimer: 0,
    cards: [],
    deck: [],
    tableId
  })

  socket.join(tableId);
  console.log(`Table ${tableId} created by ${socket.id}`);

  return callback({ 
    success: true,
    data: {
      tableId
    } 
  });
};