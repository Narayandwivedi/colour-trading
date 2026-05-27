const { WebSocketServer } = require('ws');

let wss = null;

function setupWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.subscriptions = new Set();

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'subscribe' && msg.gameType) {
          ws.subscriptions.add(msg.gameType);
        }
        if (msg.type === 'unsubscribe' && msg.gameType) {
          ws.subscriptions.delete(msg.gameType);
        }
      } catch (e) {
        // ignore invalid messages
      }
    });

    ws.on('close', () => {});
  });

  return wss;
}

function broadcast(type, data) {
  if (!wss) return;
  const message = JSON.stringify({ type, ...data });
  const clients = wss.clients;
  clients.forEach(client => {
    if (client.readyState === 1) {
      if (client.subscriptions.size === 0 || !data.gameType || client.subscriptions.has(data.gameType)) {
        client.send(message);
      }
    }
  });
}

module.exports = { setupWebSocket, broadcast };
