import React, { useState, useEffect, useContext } from 'react';
import { Nav, Tab } from 'react-bootstrap';
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
    <ol className="m-0 border-top-0">
      {history.map((value, index) => {
        return <li key={index}>{value}</li>;
      })}
    </ol>
  )
}

const UserList = () => {
  return (
    <div className="border-top-0">
      
    </div>
  )
}

const ChatInterface = ({ username, role }) => {
  return (
    <div className="col-sm-4 p-2 border-top-0 d-flex flex-column">
      <Tab.Container className="border-0" defaultActiveKey="chat" transition={false}>
        <Nav className="nav-tabs">
          <Nav.Item>
            <Nav.Link eventKey="chat">Chat</Nav.Link>
          </Nav.Item>

          {/* <Nav.Item>
            <Nav.Link eventKey="history">History</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="list">List</Nav.Link>
          </Nav.Item> */}
        </Nav>

        <Tab.Content style={{ height: "85vh"}}>
          <Tab.Pane className="card h-100 border-top-0" eventKey="chat">
            <Chat username={username} role={role} />
          </Tab.Pane>

          <Tab.Pane className="card h-100 border-top-0" eventKey="history">
            <MoveHistory />
          </Tab.Pane>

          <Tab.Pane className="card h-100 border-top-0" eventKey="list">
            <UserList />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  )
}

export default ChatInterface;