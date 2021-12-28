import next from 'next';
import express from 'express';
import config from './config';
import cookieParser from 'cookie-parser';
import { Server as SocketServer } from 'socket.io';
import { initializeSocket } from './socket';

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(cookieParser());

  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(config.PORT, () => {
    console.log(`> Ready on http://localhost:${config.PORT}`)
  });
}, (err) => {
  console.error(err);
  process.exit(1);
});
