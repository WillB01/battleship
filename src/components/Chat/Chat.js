import React, { useState, useEffect } from 'react';

import { socketActions } from '../../services/socketActions';
import useInput from '../shared/useInput';
import styles from './Chat.module.scss';

const Chat = ({ socket, type, gameName }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{}]);

  useEffect(() => {
    socket.on('sendMessageHandler', data => {
      if (data.message === '') {
        return;
      }
      data.messages.push({ message: data.message, id: data.id });
      setMessages(data.messages);
      const div = document.querySelector(`.${styles.messages}`);
      div.scrollTop = div.scrollHeight - div.clientHeight;
    });
  }, [socket.on]);

  // useEffect(() => {
  //   setMessages([]);
  // }, [type]);

  const onClickHandler = () => {
    setInput('');
    if (input === '') {
      return;
    }

    socket.emit('sendMessage', {
      message: input,
      id: socket.id,
      type,
      messages: messages,
      gameName,
    });
  };
  console.log(messages);
  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.length !== 1 &&
          messages.map((message, i) => {
            return (
              <div key={i} className={styles.message}>
                <div
                  className={`${
                    message.id === socket.id
                      ? styles.message__self
                      : styles.message__other
                  }`}
                >
                  {message.message && (
                    <div className={styles.message__text}>
                      {message.message}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className={styles.inputContainer}>
        {useInput(onClickHandler, setInput, input, 'message')}
        <div className={styles.button}>
          <i onClick={onClickHandler} className="far fa-paper-plane"></i>
        </div>
      </div>
    </div>
  );
};

export default Chat;