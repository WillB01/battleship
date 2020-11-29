import React, { useState, useEffect } from 'react';

import { socket } from '../../server/socket';
import { motion } from 'framer-motion';
import { BiMessageSquareAdd, BiMessageSquareX } from 'react-icons/bi';

import useInput from '../hooks/useInput/useInput';
import styles from './Chat.module.scss';

const Chat = ({ type, gameId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{}]);
  const [buttonHover, setButtonHover] = useState(false);
  const [showChat, setShowChat] = useState(true);

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
      gameId,
    });
  };

  const showChatHandler = () => {
    setShowChat(!showChat);
  };

  const rotateButtonVariants = {
    hide: {
      transition: {
        duration: 0.5,
      },
      height: 0,
      opacity: 0,
    },
    show: {
      transition: {
        duration: 0.5,
      },
      height: '30rem',
      opacity: 1,
    },
  };

  const spring = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };

  return (
    <motion.div>
      <motion.div className={styles.buttonContainer}>
        <div className={styles.chatIcon} onClick={() => setShowChat(!showChat)}>
          <div
            className={[!showChat ? styles.plus : styles.cross, 'center'].join(
              ' '
            )}
          ></div>
        </div>
      </motion.div>
      <motion.div
        className={styles.chat}
        variants={rotateButtonVariants}
        animate={showChat ? 'show' : 'hide'}
        initial="show"
        transition={spring}
      >
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
          {useInput(onClickHandler, setInput, input, 'message', '', true)}
          <div className={styles.button}>
            <i onClick={onClickHandler} className="far fa-paper-plane"></i>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chat;
