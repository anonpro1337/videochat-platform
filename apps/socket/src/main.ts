import { createServer } from 'http';
import { SocketServer } from './socket-server';
import { config } from '@videochat/config';

const httpServer = createServer();
const socketServer = new SocketServer(httpServer);

const port = parseInt(process.env.SOCKET_PORT || '4001', 10);

httpServer.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
  console.log(`Environment: ${config.app.env}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  httpServer.close(() => process.exit(0));
});
