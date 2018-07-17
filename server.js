const WebSocket = require('ws');

const wss = WebSocket.Server({
  port: 8080
});

wss.broadcast = function(data, clientValidator = () => true){
  this.clients.forEach(client => {
    if(clientValidator(client)) {
      client.send(data);
    }
  });
}

wss.on("connection", ws => {
  ws.on("message", message => {
    wss.broadcast(message, client => client !== wss);
  });
});
