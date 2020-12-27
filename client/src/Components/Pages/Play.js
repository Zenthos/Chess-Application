import React, { useState, useEffect, useContext } from 'react';
import Join from '../JoinModal.js';
import Canvas from '../Canvas';
import SocketProvider, { SocketContext } from '../../Context/SocketContext';
import FadeIn from '../../Animations/fade-in';
import ChatInterface from '../ChatInterface';
import '../ComponentCSS.css';

const Page = () => {
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [role, setRole] = useState('White');
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    // Disconnect socket when component unmounts
    return () => socket.close();
  }, [socket]);

  return (
    <>
      { ready ?
        <>
          <FadeIn className="col">
            <Canvas role={role} />
            <ChatInterface username={username} role={role} />
          </FadeIn>
        </>
        :
        <>
          <Join
          setReady={setReady} 
          username={username} 
          setUsername={setUsername} 
          roomName={roomName} 
          setRoomName={setRoomName} 
          role = {role}
          setRole={setRole}
          />
        </>
      }
    </>
  )
}

const Play = () => {
  return (
    <div className="row no-gutters">
      <SocketProvider>
        <Page />
      </SocketProvider>
    </div>
  );
}

export default Play;