import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { SocketContext } from '../Context/SocketContext';
import Chat from './Chat';
import '../styles/ComponentCSS.css';

const MoveHistory = () => {
  const { socket } = useContext(SocketContext);
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on('set moves', (data) => {
      setHistory(data);
    });
  }, [socket]);

  return (
    <ol className="chat-size border-top-0">
      {history.map((value, index) => {
        return <li key={index}>{value}</li>;
      })}
    </ol>
  )
}

const UserList = () => {
  return (
    <div className="chat-size border-top-0">
      
    </div>
  )
}

const ChatInterface = ({ username, role }) => {
  return (
    <div className="m-2 p-2 border-top-0">
      <Tabs className="border-0" defaultActiveKey="chat" transition={false}>
        <Tab className="card" eventKey="chat" title="Chat">
          <Chat username={username} role={role} />
        </Tab>
        <Tab className="card" eventKey="history" title="Move History">
          <MoveHistory />
        </Tab>
        <Tab className="card" eventKey="list" title="Users">
          <UserList />
        </Tab>
      </Tabs>
    </div>
  )
}

export default ChatInterface;