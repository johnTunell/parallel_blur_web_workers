function socketHandler(eventType, data, callback) {
   switch (eventType) {
       case "req_parse_tweets":
           return req_parse_tweets(eventType, data, callback);
           break;
       default:
           return std_response(eventType, data);
   }
}

function std_response(eventType, data) {
    console.log(`Client sent event: ${eventType}, with data: ${data}`);
    let response = `Hello ${data.name}!`;
    return response;
}


exports.socketHandler = socketHandler;
