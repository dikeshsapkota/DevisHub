import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';

export const setupSocketHandlers = (io: SocketIOServer) => {
  // Socket auth middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        (socket as any).userId = decoded.userId;
        (socket as any).username = decoded.username;
        return next();
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    const username = (socket as any).username;

    if (userId) {
      socket.join(`user:${userId}`);
      io.emit('user_online', { userId, username, status: 'ONLINE' });
    }

    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing_start', ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId,
        username,
        conversationId,
      });
    });

    socket.on('typing_stop', ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        userId,
        username,
        conversationId,
      });
    });

    socket.on('send_message', (messageData: any) => {
      io.to(`conversation:${messageData.conversationId}`).emit('new_message', messageData);
    });

    socket.on('disconnect', () => {
      if (userId) {
        io.emit('user_offline', { userId, username, status: 'OFFLINE' });
      }
    });
  });
};
