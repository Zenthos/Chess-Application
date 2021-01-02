import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../Context/SocketContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import FadeIn from './fade-in';
import '../styles/ComponentCSS.css';

const Message = ({msgData, index}) => {
  return (
    <FadeIn>
      <div className={`border border-dark rounded mx-2 ${ index % 2 === 1 ? 'bg-primary' : 'bg-secondary' }`}>
        <div className="p-2">
          <strong className="text-white">{msgData.name} <i>( {msgData.role} )</i></strong>
          <hr className="my-1"/>
          <p className="text-white">{msgData.msg}</p>
        </div>
      </div>
    </FadeIn>
  )
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [msgList, setMsgList] = useState([]);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on('Chat Update', (messages) => {
      setMsgList(messages);
    });

    socket.emit('Get Logs');
  }, [socket]);

  const submitHandler = (event) => {
    event.preventDefault();
    socket.emit('Send Message', message);
    setMessage('');
  }

  const messageHandler = (event) => {
    setMessage(event.target.value);
  }

  return (
    <div className="chat-size">
      <div className="mx-2 h-100">
        <ScrollToBottom className="chat-messages py-0 pt-3 mb-auto">
          {msgList.map((value, index) => {
            return <Message key={value.id} msgData={value} index={index}/>
          })}
        </ScrollToBottom>
        <form className="row m-2" onSubmit={submitHandler}>
          <input type="text" className="form-control" value={message} placeholder={"Click here to send a message!"} onChange={messageHandler} />
        </form>
      </div>
    </div>
  )
}

export default Chat;