import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { corsOptions } from "./config/cors.js";
import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";
import { configureSocket } from "./socket/index.js";

dotenv.config();

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions(),
  transports: ["websocket", "polling"]
});

app.set("io", io);
configureSocket(io);

validateEnv();
connectDB()
  .then(() => {
    server.listen(port, "0.0.0.0", () => console.log(`EditBridge API running on ${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
