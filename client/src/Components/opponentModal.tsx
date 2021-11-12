import React, { useState, useContext } from 'react';
import { CustomAlert as Alert } from './Alert';
import { SocketContext } from '../Contexts/SocketContext';
import { Link } from 'react-router-dom';
import { Modal, Button, ToggleButton } from 'react-bootstrap';
import 'src/Styles/ComponentCSS.css';

const getScale = (windowWidth: number, imageWidth: number) => {
  return ((windowWidth * 0.50) / 2) / imageWidth;
};

const randomString = (min: number, max: number) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  let id = '';
  const size = Math.random() * (max - min) + min;
  for (let i = 0; i < size; i++)
    id += chars[Math.floor(Math.random() * chars.length)];

  return `${id}`;
};

const SelectOpponent = ({ setSetupState, windowWidth }: any) => {
  const [show, setShow] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [role, setRole] = useState('');
  const [opponent, setOpponent] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const { socket } = useContext(SocketContext);

  const handleClose = () => {
    setShow(false);
  };

  const handleNext = (event: React.FormEvent) => {
    event.preventDefault();
    if (opponent === 'player') {
      setSetupState(1);
      setDisabled(true);
      setShow(false);
    } else {
      const username = randomString(6, 10);
      const room = randomString(6, 10);
      // socket.emit('join room', username, room, role, { npc: true, difficulty }, (responseData: any) => {
      //   setAlerts(responseData.responses);
      //   if (responseData.status === 'Success') {
      //     setDisabled(true);
      //     setTimeout(() => {
      //       setSetupState(2);
      //     }, 1000);
      //   }
      // });
    }
  };

  return (
    <>
      <Modal dialogClassName={getScale(windowWidth, 504) < 0.75 ? '':'width-50'} show={show} onHide={handleClose} backdrop="static" keyboard={false} animation={false} centered>
        <form onSubmit={handleNext}>
          <Modal.Header>
            <Modal.Title>Select an Opponent</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ToggleButton value={'player'} className={opponent === 'player' ? 'toggle-button-active':''}>Human</ToggleButton>
            <ToggleButton value={'npc'} className={opponent === 'npc' ? 'toggle-button-active':''}>Computer</ToggleButton>

            <div className={opponent !== 'npc' ? 'd-none':'my-3'}>
              <h5 className="text-center my-3">Choose Opponent Difficulty</h5>
              <ToggleButton value={1} className={difficulty === 1 ? 'toggle-button-active':''}>Easy</ToggleButton>
              <ToggleButton value={2} className={difficulty === 2 ? 'toggle-button-active':''}>Medium</ToggleButton>
              <ToggleButton value={3} className={difficulty === 3 ? 'toggle-button-active':''}>Hard</ToggleButton>
              <ToggleButton value={4} className={difficulty === 4 ? 'toggle-button-active':''}>Impossible</ToggleButton>

              <h5 className="text-center my-3">Select A Color to Play As</h5>
              <ToggleButton value={'White'} className={role === 'White' ? 'toggle-button-active':''}>White</ToggleButton>
              <ToggleButton value={'Black'} className={role === 'Black' ? 'toggle-button-active':''}>Black</ToggleButton>
            </div>

            { alerts.map((value: any, index) => {
              return <Alert key={index} status={value.type} message={value.msg} />;
            })}
          </Modal.Body>

          <Modal.Footer>
            <Link to="/">
              <Button variant="secondary" onClick={handleClose} disabled={disabled}>Back</Button>
            </Link>
            <Button variant="primary" disabled={!(((['White', 'Black'].includes(role) && opponent === 'npc' && [1,2,3,4].includes(difficulty))||opponent === 'player'))}>Next</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default SelectOpponent;
