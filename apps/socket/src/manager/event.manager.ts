import type { Server, Socket } from "socket.io";
import { readdirSync } from "fs";
import { join } from "path";
import type { EventResponse } from "@blackjack/game/types";

export type EventExecute<P = unknown, R = unknown> = (
  io: Server, 
  socket: Socket, 
  props: P, 
  callback: (response: EventResponse<R>) => void
) => void;

export const load = (io: Server, socket: Socket) => {
  const events = readdirSync(join(__dirname, "..", "event"));
  for (const event of events) {
    const dynamicImport = require(join(__dirname, "..", "event", event));

    const name: string = dynamicImport.name;
    if (!name) {
      throw new Error(`Event ${event} does not have a name`);
    }

    const execute: EventExecute = dynamicImport.execute;
    if (!execute) {
      throw new Error(`Event ${event} does not have an execute function`);
    }

    socket.on(name, (data, callback) => {
      console.log(`📡 Event ${name} received`, data);
      execute(io, socket, data, callback);
    });

    console.log(`🔌 Event ${name} loaded`);
  }
}