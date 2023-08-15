import { WebSocket } from 'ws';

export default function Home() {
  let port: number;
  port = 5000;

  let ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('open', () => {
    ws.send('Hello this is the client default')
  });

  ws.on('message', (data) => {
    console.log(`Recieved message: ${data}`);
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 border">
      {/*<input type='text' placeholder='Username'/>*/}

      <input type="text" placeholder="message box" />
    </div>
  );
}
