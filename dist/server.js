"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./routes/user");
const cors_1 = require("cors");
const path_1 = require("path");
const ws_1 = require("ws");
let port;
port = 5000;
const clientsConnected = new Set();
// server for chat
const wss = new ws_1.WebSocketServer({ port });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const messageText = message.toString('utf8');
        const parsedMessage = JSON.parse(messageText);
        if (parsedMessage.clientId) {
            clientsConnected.add(parsedMessage.clientId);
            wss.clients.forEach((client) => {
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        }
    });
});
console.log(`chat Listening on port ${port}`);
// server for api
let apiPort;
apiPort = 4000;
const app = (0, express_1)();
app.use((0, cors_1)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'], // You can adjust the allowed methods
}));
app.use(express_1.json());
app.use(express_1.urlencoded({ extended: true }));
app.use('/api/users', user_1.default);
app.listen(apiPort, () => {
    console.log(`api listening on port ${apiPort}`);
});
