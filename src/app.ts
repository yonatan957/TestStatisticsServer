import express from "express";
import "dotenv/config";
import { conectToMongo } from "./config/DB";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { handleSocketConnection } from "./socket/io";
import { initProject } from "./services/sidService";
import apiRouter from "./routes/apiRouter";
import eventsRouter from './routes/evnetsRouter'

const PORT = process.env.PORT;
const app = express();
const httpServer: http.Server = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.on("connection", handleSocketConnection);

conectToMongo();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);
app.use("/events", eventsRouter);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  initProject();
});
