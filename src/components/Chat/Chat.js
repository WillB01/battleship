import React, { useState, useEffect } from 'react';

import { socketActions } from '../../services/socketActions';

const Chat = ({ socket, type, gameName }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{}]);

  useEffect(() => {
    socket.on('sendMessageHandler', data => {
      data.messages.push({ message: data.message, id: data.id });
      setMessages(data.messages);
    });
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [type]);

  const onCLickHandler = () => {
    setInput('');
    socket.emit('sendMessage', {
      message: input,
      id: socket.id,
      type,
      messages: messages,
      gameName,
    });
  };

  return (
    <div>
      <div style={{ background: '#fff', width: '20rem', height: '20rem' }}>
        {messages.map((message, i) => {
          return <p>{message.message}</p>;
        })}
      </div>

      <div>
        chat
        <button onClick={onCLickHandler}>send</button>
        <input
          type="text"
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => {
            e.key === 'Enter' && onCLickHandler();
          }}
          value={input}
        />
      </div>
    </div>
  );
};

export default Chat;
