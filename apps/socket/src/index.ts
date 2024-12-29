import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { Server } from "socket.io";
import { load } from "./manager/event.manager";
import { execute as leaveTableExecute } from "./event/leave-table";
import path from "path";

const app = Fastify({
  logger: true
});

function startServer() {
  app.register(fastifyStatic, {
    root: path.join(__dirname),
    prefix: '/' 
  });

  const isProd = process.env.NODE_ENV === 'production';
  const corsConfig = {
    origin: isProd ? "https://blackjack.steellgold.fr" : "*",
    methods: ["GET", "POST"],
    credentials: true
  };

  const io = new Server(app.server, { cors: corsConfig });

  if (isProd) {
    io.use((socket, next) => {
      const origin = socket.handshake.headers.origin;
      if (origin === "https://blackjack.steellgold.fr") {
        next();
      } else {
        next(new Error("Unauthorized origin"));
      }
    });
  }

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
      console.log("🚀 Server is running on http://localhost:3001");
      console.log("🔒 CORS mode:", isProd ? "Production (restricted)" : "Development (open)");
    })
    .catch((err) => {
      app.log.error(err);
      process.exit(1);
    });
}

startServer();