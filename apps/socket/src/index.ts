import fastify from "fastify";
import { Server } from "socket.io";
import { createServer } from "http";
import { load } from "./manager/event.manager";
import { execute as leaveTableExecute } from "./event/leave-table";

const app = fastify();
const httpServer = createServer(app.server);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("✌️ New user connected");
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

httpServer.listen(3001, () => {
  console.log("🚀 Server is running on http://localhost:3001");
});