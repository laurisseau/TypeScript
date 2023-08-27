import express,{ Request, Response } from 'express';
import userRouter from './routes/user';
import cors from 'cors';
import path from 'path';
import WebSocket, { WebSocketServer } from 'ws';

let port: number;
port = 5000;

const clientsConnected: Set<string> = new Set();

// server for chat
const wss = new WebSocketServer({ port });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: WebSocket.Data) => {
    const messageText: string = message.toString('utf8');

    const parsedMessage: any = JSON.parse(messageText);

    if (parsedMessage.clientId) {
      clientsConnected.add(parsedMessage.clientId);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    }
  });
});

console.log(`chat Listening on port ${port}`);

// server for api

let apiPort: number;
apiPort = 4000;

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'], // You can adjust the allowed methods
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);

app.listen(apiPort, () => {
  console.log(`api listening on port ${apiPort}`);
});
