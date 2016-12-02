const express = require('express')
const app = express();
const server = require('http').createServer(app);

app.use(express.static(__dirname + '/blur_tutorial'));

app.get('/', function(req, res){ 
    res.sendFile(__dirname + '/blur_tutorial/blur.html');
});

/**
 * Websocket
 */
const io = require('socket.io')(server);
exports.io = io;
require('./services/websocket.js').startServerSocket();

server.listen(5000);
console.log("Webserver running on port 5000...")

exports.server = server;
