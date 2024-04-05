// socketio.js
import { Server } from "socket.io";

const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust according to your needs for production
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg); // Broadcasts the message to all clients
    });
  });
};

export default setupSocketIO;
