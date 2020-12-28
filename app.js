const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const cookieParser = require('cookie-parser');
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

const keys = require('./config/keys').module;

mongoose.connect(process.env.MONGODB_URI || keys.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
  console.log('Connection to Mongo Database Established');
});

const server = http.createServer(app);
const io = socketIO(server);
const WebSocket = require('./socket-events/socket');
const listeners = new WebSocket(io);
listeners.start();

app.use(express.json());
app.use(cookieParser());

const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', require('./routes/user'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))
} 

server.listen(PORT, () => {
  console.log(`Now listening on Port: ${PORT}`);
});