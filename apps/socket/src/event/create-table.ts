import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";

export const name = "create-table";

type CreateTableData = {
  expectedPlayers: number;
  baseBalance: number;
}

export const execute: EventExecute<CreateTableData> = async (io: Server, socket: Socket, data, callback) => {
  const { baseBalance, expectedPlayers } = data;
  const tableId = "abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWYZ1234567890".split("").sort(() => 0.5 - Math.random()).slice(0, 4).join("");

  console.log(`Creating table ${tableId} with ${expectedPlayers} players and base balance of ${baseBalance}`);

  tables.set(tableId, {
    players: [],
    gameStatus: "WAITING_FOR_PLAYERS",
    bettingTimer: 0,
    cards: [],
    deck: [],
    tableId,
    expectedPlayers,
    baseBalance,


    isSolo: false // TODO.
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