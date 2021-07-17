const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


//Single Channel
const {Chat} = require("./Chat.js");
var GlobalChat = new Chat(io);
//DONE !


/* TODO: route to other chats */
io.on('connection', (user) => { 
  GlobalChat.OnUserConnect(user);
});

app.get('/*', (req, res) => {
  res.sendFile(req.url, { root: __dirname});
});


server.listen(80, () => {
  console.log('listening on *:80');
});