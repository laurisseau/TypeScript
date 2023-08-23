'use client';
import { useState } from 'react';
import '../styles/chats.css';

interface ChatMessageEvent extends MessageEvent {
  data: {
    text: () => Promise<string>;
  };
}

export default function Chat() {
  const [message, setMessage] = useState<string>(''); // State to hold the message

  let port: number = 5000;

  let ws = new WebSocket(`ws://localhost:${port}`);

  ws.onmessage = async (event: ChatMessageEvent) => {
    const receivedText = await event.data.text(); // Convert Blob to text
    console.log(`Received message: ${receivedText}`);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      ws.send(message); // Sending the message to the server
      //console.log('Message sent:', message);
      setMessage(''); // Clearing the message input
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 border">
      <h1>Chat</h1>

      <input
        type="text"
        placeholder="Type your message"
        value={message} // Binding the input value to the message state
        onChange={(e) => setMessage(e.target.value)} // Update the message state on input change
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
