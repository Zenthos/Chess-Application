import path from 'path';
import http from 'http';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { keys } from './config';
import { forumRouter, userRouter } from './routes';

const app = express();
const server = http.createServer(app);

mongoose.connect(keys.MongoURI, {}, () => {
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

app.use('/user', userRouter);
app.use('/forum', forumRouter);

app.use(
  express.static(path.join(__dirname, '../../', 'client' , 'build'))
);

server.listen(keys.PORT, () => {
  console.log(`Now listening on Port: ${keys.PORT}`);
});
