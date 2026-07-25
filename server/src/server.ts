import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { app } from './app.js';
import { setupSocketHandlers } from './sockets/index.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`⚡ DevisHub Backend Engine running on http://localhost:${PORT}`);
});
