import React, { useState, useEffect, useContext } from 'react';
import SelectRoom from '../roomModal.js';
import SelectOpponent from '../opponentModal.js';
import Canvas from '../Canvas';
import useImage from 'use-image';
import SocketProvider, { SocketContext } from '../../Context/SocketContext';
import FadeIn from '../../Animations/fade-in';
import ChatInterface from '../ChatInterface';
import '../ComponentCSS.css';

const Page = () => {
  const [setupState, setSetupState] = useState(0);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [opponent, setOpponent] = useState('');
  const [role, setRole] = useState('White');
  const { socket } = useContext(SocketContext);
  
  const [boardImg] = useImage('/chess-images/board.png');
  const [figureImg] = useImage('/chess-images/figures.png');
  
  useEffect(() => {
    // Disconnect socket when component unmounts
    return () => socket.close();
  }, [socket]);

  const ChooseOpponent = () => {

    return (
      <>
        <SelectOpponent
          setSetupState={setSetupState} 
          setOpponent={setOpponent}
          setUsername={setUsername} 
          setRoomName={setRoomName} 
        />
      </>
    )
  }

  const ChooseRoom = () => {
    return (
      <>
        <SelectRoom
          setSetupState={setSetupState} 
          username={username} 
          setUsername={setUsername} 
          roomName={roomName} 
          setRoomName={setRoomName} 
          role = {role}
          setRole={setRole}
          opponent={opponent}
          />
      </>
    )
  }

  const ReadyToPlay = () => {
    return (
      <FadeIn className="container">
        <Canvas role={role} boardImg={boardImg} figureImg={figureImg} />
        <ChatInterface username={username} role={role} />
      </FadeIn>
    )
  }

  const gameSetup = () => {
    if (setupState === 0) return <ChooseOpponent />;
    if (setupState === 1) return <ChooseRoom />;
    if (setupState === 2) return <ReadyToPlay />;
  }

  return (
    <>
      {gameSetup()}
    </>
  )
}

const Play = () => {
  return (
    <SocketProvider>
      <Page />
    </SocketProvider>
  );
}

export default Play;