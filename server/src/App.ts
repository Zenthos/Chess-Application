import path from 'path';
import http from 'http';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { keys } from './Config';
import { Server as SocketServer } from 'socket.io';
import { forumRouter, userRouter, stripeRouter } from './Routes';
import { initializeSocket } from './Socket';

export const app = express();
export const server = http.createServer(app);
const io = new SocketServer(server);
initializeSocket(io);

mongoose.connect(keys.MONGO_URI, {}, () => {
  console.log('Connection to Mongo Database Established');
});

mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error('Failed To Connect to Mongodb.\n' + err);
  }
});

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/', stripeRouter);
app.use('/user', userRouter);
app.use('/forum', forumRouter);

app.use(
  express.static(path.join(__dirname, '../../', 'client' , 'build'))
);
