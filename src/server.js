const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080, maxPayload: 1024 * 1024 * 1024 });
const clients = [];

server.on("connection", (ws) => {
  console.log("Client connected");
  const clientInfo = { ws, id: Date.now() };
  clients.push(clientInfo);

  broadcastUserList();

  ws.on("message", (message) => {
    const { fileName, fileBuffer } = JSON.parse(message);

    clients.forEach((client) => {
      if (client.ws !== ws && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({ fileName, fileBuffer }));
      }
    });

    console.log(`File received and broadcasted: ${fileName}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.splice(clients.indexOf(clientInfo), 1);
    broadcastUserList();
  });
});

function broadcastUserList() {
  const userList = clients.map((client) => client.id);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({ type: "userList", users: userList }));
    }
  });
}

console.log(`WebSocket server is running on ${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);
