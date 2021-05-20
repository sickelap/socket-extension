import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { AddressInfo } from 'net';
import express from 'express';
import { onConnection } from './handler';
import package_json from '../package.json';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:2080' },
});

app.get('/status', (req, res) => {
  res.send({ name: process.env.APP_NAME || package_json.name, status: 'OK' });
});

io.on('connection', (socket: Socket) => onConnection(io, socket));

httpServer.listen(process.env.PORT || 3000, () => {
  const address = httpServer.address() as AddressInfo;
  console.log(`Server is listening on ${address.address}:${address.port}`);
});
