'use client';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import '@/styles/chats.css';
import { Context } from '../Provider';

interface ChatMessageEvent extends MessageEvent {
  data: {
    text: () => Promise<string>;
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<
    { clientId: string; message: string }[]
  >([]);

  let port: number = 5000;
  let ws = new WebSocket(`ws://localhost:${port}`);
  const { state } = useContext(Context);
  const { userInfo } = state;
  interface serverObj {
    clientId: string;
    message: string;
  }
  const initialMessage: serverObj = { clientId: '', message: '' };
  const [newMessage, setNewMessage] = useState<serverObj>(initialMessage);

  ws.onopen = () => {
    // Sending client ID along with a message to the server
    ws.send(JSON.stringify({ clientId: userInfo?.sub, message: '' }));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.message.trim() !== '') {
      ws.send(JSON.stringify(newMessage)); // Sending only the message to the server
      setMessages([
        ...messages,
        { clientId: userInfo?.sub || '', message: newMessage.message },
      ]);
      setNewMessage({ ...newMessage, message: '' }); // Clearing the message input
    }
  };

  ws.onmessage = (event) => {
    const newObj = JSON.parse(event.data);
    console.log(newObj.message);
    if (newObj.message) {
      messages.push({ clientId: userInfo?.sub || '', message: newObj.message });
    }
  };

  console.log(messages);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage({ clientId: userInfo?.sub || '', message: e.target.value });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 border">
      {userInfo ? (
        <>
          <div className="message-ui border">
            <div className="message-list">
              {messages.map((message, index) => (
                <div key={index} className={`message user`}>
                  {message.message}
                </div>
              ))}
            </div>
            <form className="message-input" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage.message}
                onChange={handleInputChange}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </>
      ) : (
        <div>Please Login</div>
      )}
    </div>
  );
}
