import http from "http";
import Express from "express";
import { Server } from "socket.io";

const PORT = 5000;

const app = Express();
const server = http.createServer(app);
const io = new Server(server);

app.use(Express.static("../client/"));

io.on("connection", (socket) => {
  console.log("User connected");
});



server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
