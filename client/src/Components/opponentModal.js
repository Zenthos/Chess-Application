import React, { useState, useContext } from 'react';
import Alert from './Alert';
import { SocketContext } from '../Context/SocketContext';
import { Link } from 'react-router-dom';
import { Modal, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import '../styles/ComponentCSS.css';

const getScale = (windowWidth, imageWidth) => {
  return ((windowWidth * 0.50) / 2) / imageWidth;
}

const randomString = (length) => {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  let id = '';
  for (let i = 0; i < length + 3; i++) 
    id += chars[Math.floor(Math.random() * chars.length)];

  return `${id}`;
}

const SelectOpponent = ({ setSetupState, windowWidth }) => {
  const [show, setShow] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [opponent, setOpponent] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const { socket } = useContext(SocketContext);

  const handleClose = () => {
    setShow(false);
  }

  const handleNext = (event) => {
    event.preventDefault();
    if (opponent === 1) {
      setSetupState(opponent);
      setDisabled(true);
      setShow(false);
    } else {
      let username = randomString(10);
      let room = randomString(10);
      socket.emit('join room', username, room, 'White', function (responseData) {
        setAlerts(responseData.responses);
        if (responseData.status === 'Success') {
          setDisabled(true);
          setTimeout(() => {
            setSetupState(2);
          }, 1000)
        }
      });
    }
  }

  return (
    <>
      <Modal dialogClassName={getScale(windowWidth, 504) < 0.75 ? "":"modal-join"} show={show} onHide={handleClose} backdrop="static" keyboard={false} animation={false} centered>
        <form onSubmit={handleNext}>
          <Modal.Header>
            <Modal.Title>Select an Opponent</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ToggleButtonGroup className="d-flex" type="checkbox" value={opponent} onChange={([a, b]) => setOpponent(b)}>
              <ToggleButton value={1} disabled={opponent === 1 ? true:false}>Human</ToggleButton>
              <ToggleButton value={2} disabled={opponent === 2 ? true:false}>Computer (Not Working)</ToggleButton>
            </ToggleButtonGroup>

            <div className={opponent !== 2 ? 'd-none':'my-3'}>
              <h5 className="text-center my-3">Choose Opponent Difficulty</h5>
              <ToggleButtonGroup className="d-flex" type="checkbox" value={difficulty} onChange={([a, b]) => setDifficulty(b)}>
                <ToggleButton value={1} disabled={difficulty === 1 ? true:false}>Easy</ToggleButton>
                <ToggleButton value={2} disabled={difficulty === 2 ? true:false}>Medium</ToggleButton>
                <ToggleButton value={3} disabled={difficulty === 3 ? true:false}>Hard</ToggleButton>
                <ToggleButton value={4} disabled={difficulty === 4 ? true:false}>Impossible</ToggleButton>
              </ToggleButtonGroup>
            </div>

            { alerts.map((value, index) => {
              return <Alert key={index} status={value.type} message={value.msg} />
            })}
          </Modal.Body>
          
          <Modal.Footer>
            <Link to="/">
              <Button variant="secondary" type="Submit" onClick={handleClose} disabled={disabled}>Back</Button>
            </Link>
            <Button variant="primary" type="Submit" disabled={((opponent === 2 && [1,2,3,4].includes(difficulty))||opponent === 1)? false:true}>Next</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default SelectOpponent;