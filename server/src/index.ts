import path from 'path';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { keys } from './config';
import { Server } from 'socket.io';
import { forumRouter, userRouter } from './routes';

const PORT = process.env['PORT'] || 8000;
const app = express();
const server = http.createServer(app);

mongoose.connect(process.env['MONGODB_URI'] || keys.MongoURI, {}, () => {
  console.log('Connection to Mongo Database Established');
});

mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error('Failed To Connect to Mongodb.\n' + err);
  }
});

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/forum', forumRouter);

app.use(
  express.static(path.join(__dirname, '../../', 'client' , 'build'))
);

server.listen(PORT, () => {
  console.log(`Now listening on Port: ${PORT}`);
});
