const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8181 });
const clients = [];

// server needs to keep track of client ID to maintain one connection per client
wss.on('connection', function connection(ws) {
  // trackClient(ws);
  ws.on('message', function incoming(message) {
    console.log(`Received: ${message}`);
    message = message.replace(/['"]+/g, '');
    if (message === 'x') {
      let i = 0;
      let interv = setInterval(() => {
        if (i === 10) {
          clearInterval(interv);
          ws.send('Terminated');
          ws.terminate();
        } else {
          ws.send(i, function(e) {
            // stop the interval if an error has occurred - a client reload/close the browser
            if (e) {
              clearInterval(interv);
            }
          });
        }
        i++;
      }, 1000);
    }
  });

  ws.on('close', function(e) {
    console.log(e);
    console.log('Closing');
  });

  ws.on('error', function(e) {
    console.log(e);
  });
});

wss.on('error', function(e) {
  console.log(e);
});

function heartbeat() {
  this.isAlive = true;
}

function trackClient(ws) {
  clients.push(ws);
  ws.isAlive = true;
  ws.on('pong', heartbeat);
}

function broadcast() {
  for (const client of clients) {
    client.send(message);
  }
}
function noop() {}

function monitor() {
  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      console.log(ws.isAlive);
      if (ws.isAlive === false) {
        console.log('terminated');
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 1000);
}
