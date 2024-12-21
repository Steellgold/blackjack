import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";

export const name = "join-table";

type JoinTableProps = {
  tableId: string;
  playerName: string;
}

export const execute: EventExecute<JoinTableProps> = async (io: Server, socket: Socket, data, callback) => {
  return callback({ success: true });
};
