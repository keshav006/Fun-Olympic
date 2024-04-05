import "express-async-errors";
import { Server } from "socket.io";


import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import notFoundHandler from "./middleware/notFoundHandler.middleware.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import apiRouter from "./routes/index.js";
import { corsHandler } from "./middleware/cors.middleware.js";

import http from 'http';
import { createChat } from "./services/livechat.js";

dotenv.config();


const PORT = process.env.PORT || 8000;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {cors: {
  origin: "*",
}},)


io.on("connection", (socket) => {
  socket.on("joinChat", (eventId) => {
    socket.join(`event-${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", async (data) => {
    console.log("Received eventId", data.eventId)
    const { message, userId, eventId } = data   
    const chatResponse = await createChat({userId, body: message, eventId })
      io.to(`event-${eventId}`).emit("chat message",chatResponse);
    });
})



app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsHandler);
app.use(bodyParser.json());

app.use("/api/v1", apiRouter);

app.use(notFoundHandler); // Not found middleware. It will get triggered when user try to access invalid route.

app.use(errorHandler); // Error handler middleware. It will get triggered when any error is encounterd in our app.

server.listen(PORT, () => {
  console.log(`Server started successfully in http://localhost:${PORT}`);
});

