import express from 'express';
import { WebSocketServer } from 'ws';

let port: number;

port = 5000;
const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {

  ws.on('message', (data) => {
    console.log(`Received message from client: ${data}`)
  })

  ws.send('Hello this is the server.')
})

console.log(`Listening on port ${port}`)


