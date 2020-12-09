import React from 'react';
import Chat from './Chat';
import MoveHistory from './MoveHistory';
import { Tabs, Tab } from 'react-bootstrap';
import './ComponentCSS.css';

const UserList = () => {
  return (
    <div className="chat-size">
      
    </div>
  )
}

const PlayTab = ({ username, role }) => {
  return (
    <div className="m-2 p-2">
      <Tabs defaultActiveKey="chat">
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

export default PlayTab;