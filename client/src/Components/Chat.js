import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../Context/SocketContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import FadeIn from '../Animations/fade-in';
import './ComponentCSS.css';

const Message = ({name, msg, role, index}) => {
  return (
    <FadeIn>
      <div className={`border border-dark rounded mx-2 ${ index % 2 === 1 ? 'bg-primary' : 'bg-secondary' }`}>
        <div className="p-2">
          <strong className="text-white">{name} <i>( {role} )</i></strong>
          <hr className="my-1"/>
          <p className="text-white">{msg}</p>
        </div>
      </div>
    </FadeIn>
  )
}

const Chat = ({ username, role }) => {
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
    socket.emit('Send Message', username, message, role);
    setMessage('');
  }

  const messageHandler = (event) => {
    setMessage(event.target.value);
  }

  return (
    <div className="chat-size">
      <div className="m-2 h-100">
        <ScrollToBottom className="chat-messages py-0 mt-3 mb-auto">
          {msgList.map((value, index) => {
            return <Message key={index} name={value.name} msg={value.msg} role={value.role} index={index}/>
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