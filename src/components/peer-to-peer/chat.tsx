import React, { useState } from 'react';
import SimplePeer, { SignalData } from 'simple-peer';
import io from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [peer, setPeer] = useState<any | null>(null);

  // Connect to the Socket.io server
  const socket = io('http://localhost:3000');

  // Set up the Simple Peer connection
  const setupPeer = (initiator: boolean) => {
    const p = new SimplePeer({ initiator });

    p.on('signal', (data: SignalData) => {
      // Send the signal data to the server via Socket.io
      socket.emit('signal', JSON.stringify(data));
    });

    p.on('data', (data) => {
      // Handle incoming message
      const message = JSON.parse(data) as Message;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setPeer(p);
  };

  // Handle sending messages
  const sendMessage = (message: string) => {
    // Send the message to the peer
    peer!.send(JSON.stringify({
      id: Date.now().toString(),
      text: message,
      sender: 'You',
    }));
    setMessages((prevMessages) => [...prevMessages, {
      id: Date.now().toString(),
      text: message,
      sender: 'You',
    }]);
  };

  // Handle incoming messages from the server
  socket.on('signal', (data) => {
    // Signal the peer connection with the incoming data
    peer!.signal(JSON.parse(data));
  });

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.sender}: {message.text}</p>
        </div>
      ))}
      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage(e.currentTarget.message.value);
        e.currentTarget.message.value = '';
      }}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
