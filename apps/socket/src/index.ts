import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { Server } from "socket.io";
import { load } from "./manager/event.manager";
import { execute as leaveTableExecute } from "./event/leave-table";
import path from "path";

const app = Fastify();

function startServer() {
  app.register(fastifyStatic, {
    root: path.join(__dirname),
    prefix: '/' 
  });

  const isProduction = process.env.NODE_ENV === "production";
  const io = new Server(app.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("✌️ New user connected from:", socket.handshake.headers.origin);
    load(io, socket);

    socket.on("disconnect", () => {
      console.log("👋 User disconnected");
      try {
        leaveTableExecute(io, socket, undefined, (response) => {
          if (!response.success) {
            console.log("Error during leave-table:", response.error);
          }
        });
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  app.listen({ port: 3001 })
    .then(() => {
      console.log("🚀 Server is running on " + (isProduction ? "http://socket.blackjack.steellgold.fr/" : "http://localhost:3001"));
    })
    .catch((err) => {
      app.log.error(err);
      process.exit(1);
    });
}

startServer();