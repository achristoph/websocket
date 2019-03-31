const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8181 });
// server needs to keep track of client ID to maintain one connection per client
const clients = {};
const clientsI = {};
const ReadyState = {
  CONNECTING: 0, // Socket has been created. The connection is not yet open.
  OPEN: 1, // The connection is open and ready to communicate.
  CLOSING: 2, // The connection is in the process of closing.
  CLOSED: 3 // The connection is closed or couldn't be opened.
};

wss.on('connection', function connection(ws) {
  console.log('connecting to a client');
  ws.on('message', function incoming(payload) {
    payload = JSON.parse(payload);
    let client = clients[payload.user];
    let i = clientsI[payload.user];

    if (!client) {
      trackClient(payload.user, ws);
      client = ws;
      i = 0;
    }

    console.log(`Received: ${payload.message}`);
    let interv = setInterval(() => {
      console.log(i);
      if (i === 100) {
        clearInterval(interv);
        ws.send('Done');
      } else {
        if (ws.readyState === ReadyState.OPEN) {
          ws.send(i, function(e) {
            // if (ws.readyState === 1) guards sending a message when socket is already closed
            if (e) {
              // without the if guard above, we need to stop the interval if an error has occurred - a client reloads/closes the browser
              console.log('asdfasdfasdf');
              console.log(e);
              clearInterval(interv);
            }
          });
        }
      }
      clientsI[payload.user] = i;
      i++;
    }, 1000);
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

function trackClient(user, ws) {
  clients[user] = ws;
  ws.isAlive = true;
  ws.on('pong', heartbeat);
}

function broadcast(message) {
  for (const client of this.clients) {
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
