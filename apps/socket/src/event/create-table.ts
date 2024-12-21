import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";

export const name = "create-table";

export const execute: EventExecute = async (io: Server, socket: Socket, _, callback) => {
  return callback({
    data: {
      message: "Table created"
    },
    tableId: "123"
  });
}