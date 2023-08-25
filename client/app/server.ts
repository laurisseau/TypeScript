import { WebSocketServer } from 'ws';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user';
import config from './config/default';

let port: number;
port = 5000;

// server for chat
const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log(`Received message from client: ${data}`);
    ws.send(data);
  });
});

console.log(`chat Listening on port ${port}`);

// server for api

let apiPort: number;
apiPort = 6000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);

app.listen(apiPort, () => {
  console.log(`api listening on port ${apiPort}`);
});
