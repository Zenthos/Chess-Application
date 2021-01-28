import React, { useState, useEffect, useContext } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import { SocketContext } from '../Context/SocketContext';
import Chat from './Chat';
import FadeIn from '../Components/fade-in';
import '../styles/ComponentCSS.css';

const MoveHistory = () => {
  const { socket } = useContext(SocketContext);  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on('Update Moves', (data) => setHistory([...data]));
  }, [socket]);

  return (
    <div class="h-100">
      <ul className="list-group border-top-0 h-100 overflow-auto m-0 p-2">
        {history.map((move, index) => {
          return (
            <FadeIn>
              <li className="list-group-item" key={index}>{`${index}. ${move.color} - ${move.from} ${move.to}`}</li>
            </FadeIn>
          )
        })}
      </ul>
    </div>
  )
}

const UserList = () => {
  const { socket } = useContext(SocketContext);  
  const [list, setList] = useState([]);

  useEffect(() => {
    socket.on('Update Players', (data) => setList([...data]));

    socket.emit('Get Players');
  }, [socket]);

  return (
    <div class="h-100">
      <ul className="list-group border-top-0 h-100 overflow-auto m-0 p-2">
        {list.map((player, index) => {
          return (
            <FadeIn>
              <li className="list-group-item" key={index}>{`${player.username} - ${player.role}`}</li>
            </FadeIn>
          )
        })}
      </ul>
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

          <Nav.Item>
            <Nav.Link eventKey="history">History</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="list">Users</Nav.Link>
          </Nav.Item>
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