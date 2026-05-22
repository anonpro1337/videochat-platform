import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { config } from '@videochat/config';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'hangup' | 'mute' | 'unmute' | 'camera-on' | 'camera-off';
  sdp?: string;
  candidate?: RTCIceCandidateInit;
  matchId: string;
  targetUserId: string;
}

export class SocketServer {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.socket.corsOrigin === '*' ? true : config.socket.corsOrigin,
        credentials: true,
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ['websocket', 'polling'],
    });

    // Redis adapter for horizontal scaling
    try {
      this.io.adapter(createAdapter(config.redis.url));
    } catch (err) {
      console.warn('Redis adapter not available, using default in-memory adapter');
    }

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token as string;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      try {
        const payload = jwt.verify(token, config.jwt.secret) as { sub: string; role: string };
        socket.userId = payload.sub;
        socket.userRole = payload.role;
        next();
      } catch {
        next(new Error('Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      if (!socket.userId) return;

      console.log(`User connected: ${socket.userId} (${socket.id})`);

      // Join user's personal room
      socket.join(`user:${socket.userId}`);

      // Update presence
      this.io.emit('user:online', { userId: socket.userId });
      this.updateUserStatus(socket.userId, 'online');

      // ===== Matching Events =====
      socket.on('match:join', (data: { type: string }) => {
        socket.join(`match:queue:${data.type}`);
        socket.broadcast.to(`match:queue:${data.type}`).emit('match:user-joined', {
          userId: socket.userId,
          type: data.type,
        });
      });

      socket.on('match:leave', (data: { type: string }) => {
        socket.leave(`match:queue:${data.type}`);
      });

      socket.on('match:found', (data: { matchId: string; partnerId: string }) => {
        socket.join(`match:${data.matchId}`);
        this.io.to(`user:${data.partnerId}`).emit('match:found', {
          matchId: data.matchId,
          partnerId: socket.userId,
        });
      });

      socket.on('match:skip', (data: { matchId: string }) => {
        socket.leave(`match:${data.matchId}`);
        this.io.to(`match:${data.matchId}`).emit('match:skipped', {
          matchId: data.matchId,
          skippedBy: socket.userId,
        });
      });

      // ===== WebRTC Signaling =====
      socket.on('signal:send', (data: SignalingMessage) => {
        socket.broadcast.to(`user:${data.targetUserId}`).emit('signal:receive', {
          ...data,
          fromUserId: socket.userId,
        });
      });

      // ===== Chat Events =====
      socket.on('chat:typing', (data: { matchId: string; isTyping: boolean }) => {
        socket.broadcast.to(`match:${data.matchId}`).emit('chat:typing', {
          matchId: data.matchId,
          userId: socket.userId,
          isTyping: data.isTyping,
        });
      });

      socket.on('chat:message', (data: { matchId: string; message: any }) => {
        this.io.to(`match:${data.matchId}`).emit('chat:message', {
          ...data.message,
          senderId: socket.userId,
        });
      });

      socket.on('chat:reaction', (data: { matchId: string; messageId: string; emoji: string }) => {
        socket.broadcast.to(`match:${data.matchId}`).emit('chat:reaction', {
          ...data,
          userId: socket.userId,
        });
      });

      // ===== Call Events =====
      socket.on('call:offer', (data: { targetUserId: string; callId: string; sdp: string }) => {
        this.io.to(`user:${data.targetUserId}`).emit('call:incoming', {
          callerId: socket.userId,
          callId: data.callId,
          sdp: data.sdp,
        });
      });

      socket.on('call:answer', (data: { targetUserId: string; callId: string; sdp: string }) => {
        this.io.to(`user:${data.targetUserId}`).emit('call:answered', {
          calleeId: socket.userId,
          callId: data.callId,
          sdp: data.sdp,
        });
      });

      socket.on('call:ice-candidate', (data: { targetUserId: string; candidate: RTCIceCandidateInit }) => {
        this.io.to(`user:${data.targetUserId}`).emit('call:ice-candidate', {
          candidate: data.candidate,
          fromUserId: socket.userId,
        });
      });

      socket.on('call:end', (data: { matchId: string; callId: string }) => {
        socket.leave(`call:${data.callId}`);
        socket.broadcast.to(`match:${data.matchId}`).emit('call:ended', {
          callId: data.callId,
          endedBy: socket.userId,
        });
      });

      // ===== Friend Events =====
      socket.on('friend:request', (data: { targetUserId: string }) => {
        this.io.to(`user:${data.targetUserId}`).emit('friend:request', {
          fromUserId: socket.userId,
        });
      });

      socket.on('friend:accept', (data: { targetUserId: string }) => {
        this.io.to(`user:${data.targetUserId}`).emit('friend:accepted', {
          userId: socket.userId,
        });
      });

      // ===== Notification Events =====
      socket.on('notification:read', (data: { notificationId: string }) => {
        socket.emit('notification:read-ack', { notificationId: data.notificationId });
      });

      // ===== Livestream Events =====
      socket.on('stream:join', (data: { streamId: string }) => {
        socket.join(`stream:${data.streamId}`);
        this.io.to(`stream:${data.streamId}`).emit('stream:viewer-joined', {
          userId: socket.userId,
        });
      });

      socket.on('stream:leave', (data: { streamId: string }) => {
        socket.leave(`stream:${data.streamId}`);
        this.io.to(`stream:${data.streamId}`).emit('stream:viewer-left', {
          userId: socket.userId,
        });
      });

      socket.on('stream:gift', (data: { streamId: string; giftId: string; quantity: number }) => {
        this.io.to(`stream:${data.streamId}`).emit('stream:gift-received', {
          fromUserId: socket.userId,
          giftId: data.giftId,
          quantity: data.quantity,
        });
      });

      // ===== Disconnection =====
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId} (${socket.id})`);
        this.io.emit('user:offline', { userId: socket.userId });
        this.updateUserStatus(socket.userId, 'offline');
      });
    });
  }

  private async updateUserStatus(userId: string, status: 'online' | 'offline') {
    // In production, update via API call to the main service
    try {
      const fetch = await import('node-fetch');
      await fetch.default(`${config.urls.api}/api/v1/users/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });
    } catch {
      // Silently fail - status is best effort
    }
  }

  getIO(): Server {
    return this.io;
  }
}
