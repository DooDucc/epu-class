import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./controllers/chatController";
dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(cors());
app.use(cookieParser());

app.use("/api", router);

export const prismaClient = new PrismaClient({
  log: [],
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupSocketHandlers(io);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
