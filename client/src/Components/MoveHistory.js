import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../Context/SocketContext';
import './ComponentCSS.css';

const MoveHistory = () => {
  const { socket } = useContext(SocketContext);
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on('set moves', (data) => {
      setHistory(data);
    });
  }, [socket]);

  return (
    <ol className="chat-size pl-4">
      {history.map((value, index) => {
        return <li key={index}>{value}</li>;
      })}
    </ol>
  )
}

export default MoveHistory;