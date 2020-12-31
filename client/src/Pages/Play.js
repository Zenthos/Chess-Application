import React, { useState, useEffect, useContext } from 'react';
import { Canvas, SelectRoom, SelectOpponent, /*ChatInterface,*/ FadeIn } from '../Components';
import SocketProvider, { SocketContext } from '../Context/SocketContext';
// import WindowProvider, { WindowContext } from '../Context/WindowContext';
import '../styles/ComponentCSS.css';

const Page = () => {
  const [setupState, setSetupState] = useState(0);
  const [opponent, setOpponent] = useState('');
  const [width, setWidth] = useState(window.innerWidth);

  const { socket } = useContext(SocketContext);
  
  // Disconnect socket when component unmounts
  useEffect(() => {
    return () => socket.close();
  }, [socket]);

  // Get Window Size
  useEffect(() => {
    const resizeListener = () => setWidth(window.innerWidth);

    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, [width]);

  const ChooseOpponent = () => {

    return (
      <>
        <SelectOpponent
          setSetupState={setSetupState} 
          setOpponent={setOpponent}
          windowWidth={width}
        />
      </>
    )
  }

  const ChooseRoom = () => {
    return (
      <>
        <SelectRoom
          setSetupState={setSetupState} 
          opponent={opponent}
          windowWidth={width}
          />
      </>
    )
  }

  const ReadyToPlay = () => {
    return (
      <FadeIn className="container">
        <Canvas windowWidth={width} />
        {/* <ChatInterface username={username} /> */}
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
  )
}

export default Play;