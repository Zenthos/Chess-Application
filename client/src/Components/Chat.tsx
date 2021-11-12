import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from 'src/Contexts/SocketContext';
import FadeIn from './fade-in';
import 'src/Styles/ComponentCSS.css';

const Message = ({ msgData, index }: any) => {
  return (
    <FadeIn>
      <div className={`border border-dark rounded mx-2 ${ index % 2 === 1 ? 'bg-dark' : 'bg-secondary' }`}>
        <div className="p-2">
          <strong className="text-white">{msgData.name} <i>( {msgData.role} )</i></strong>
          <hr className="my-1"/>
          <p className="text-white">{msgData.msg}</p>
        </div>
      </div>
    </FadeIn>
  );
};

const Chat = () => {
  const [message, setMessage] = useState('');
  const [msgList, setMsgList] = useState([]);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    // socket.on('Chat Update', (messages) => {
    //   setMsgList(messages);
    // });

    // socket.emit('Get Logs');
  }, [socket]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.length > 0) {
      // socket.emit('Send Message', message);
      setMessage('');
    }
  };

  const messageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    if (msgList.length > 0) true;
  };

  return (
    <div className="h-100 mx-2">
      {msgList.map((value, index) => {
        return <Message key={index} msgData={value} index={index}/>;
      })}
      <form className="p-2" onSubmit={submitHandler}>
        <input type="text" className="form-control" value={message} placeholder={'Click here to send a message!'} onChange={messageHandler} />
      </form>
    </div>
  );
};

export default Chat;
