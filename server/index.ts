import next from 'next';
import express from 'express';
import cookieParser from 'cookie-parser';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, port: Number(process.env.PORT) });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(cookieParser());

  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(process.env.PORT, () => {
    console.log(`> Ready on http://localhost:${process.env.PORT}`)
  });
}, (err) => {
  console.error(err);
  process.exit(1);
});
