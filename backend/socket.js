const Websocket = require("ws");

handleMessage = (connectionManager, messageContents, ws) => {
  const bucketID = ws.bucketID;
  const clients = connectionManager.buckets[bucketID];

  clients.forEach((client) => {
    if (client.readyState === Websocket.OPEN) {
      client.send(JSON.stringify(messageContents));
    }
  });
}

handleUserConnect = (connectionManager, messageContents, ws) => {
  const bucketID = messageContents.bucketID;
  
  ws.bucketID = bucketID;

  if (connectionManager.hasOwnProperty(bucketID)) {
    connectionManager.buckets[bucketID].add(ws);
  } else {
    connectionManager.buckets[bucketID] = new Set([ws]);
  }
}

handleUserDisconnect = (connectionManager, ws) => {
  connectionManager.buckets[ws.bucketID].delete(ws);

  if (connectionManager.buckets[ws.bucketID].size === 0) {
    delete connectionManager.buckets[ws.bucketID];
  }
}

module.exports = function(wss, connectionManager) {
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const messageContents = JSON.parse(message);
        if (messageContents.hasOwnProperty("new")) {
          handleUserConnect(connectionManager, messageContents, ws);
        } else {
          handleMessage(connectionManager, messageContents, ws);
        }
      });

      ws.on('close', () => {
        handleUserDisconnect(connectionManager, ws);
      });
                                                            
      ws.on('error', (error) => {
        console.log(error);
      });
    });
}
