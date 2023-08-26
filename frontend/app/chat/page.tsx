'use client';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import '@/styles/chats.css';
import { Context } from '../Provider';
import Button from 'react-bootstrap/Button';

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const newObj = JSON.parse(event.data) as {
        clientId: string;
        message: string;
      };

      if (newObj.message) {
        if (userInfo?.sub) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { clientId: newObj.clientId, message: newObj.message },
          ]);
        }
      }
    };

    ws.onmessage = handleMessage;

    // Clean up the event handler when the component unmounts
    return () => {
      ws.onmessage = null;
    };
  }, [ws, userInfo]);

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
                <div
                  key={index}
                  className={`message ${
                    message.clientId == userInfo?.sub ? 'user' : 'other'
                  }`}
                >
                  {message.message}
                </div>
              ))}
            </div>
            <form className="message-input" onSubmit={sendMessage}>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage.message}
                  onChange={handleInputChange}
                />
              </div>
              <Button className="w-100" type="submit">
                Send
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div>Please Login</div>
      )}
    </div>
  );
}
