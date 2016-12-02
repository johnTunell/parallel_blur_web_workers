const serverSocket = require('./../webserver.js').io;
const socketRoutes = require('./socket_routes.js');

function startServerSocket() {
    serverSocket.on('connection', (clientSocket) => {
        console.log("A client connected");
        clientSocket.emit('welcome', "Hello there client");

        /**
         * Socket Routes
         */
        
        clientSocket.on('req_parse_tweets', (data) => {
            socketRoutes.socketHandler('req_parse_tweets', data, (response) => {
                clientSocket.emit('res_parse_tweets', response);
            });
        });
    });
}

exports.startServerSocket = startServerSocket;
