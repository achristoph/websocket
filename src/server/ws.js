const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8181 });
const clients = [];

// server needs to keep track of client IP address
wss.on('connection', function connection(ws) {
  clients.push(ws);
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    for (const client of clients) {
      client.send(message);
    }
  });

  ws.on('close', function() {
    console.log('Closing');
  });

  ws.on('error', function() {
    console.log('ERROR!');
  });
});

function heartbeat() {
  this.isAlive = true;
}

function noop() {}
const interval = setInterval(function ping() {
  console.log(wss.clients.size);

  wss.clients.forEach(function each(ws) {
    console.log(ws.isAlive);
    if (ws.isAlive === false) {
      console.log('terminate');

      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 1000);
