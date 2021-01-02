import React, { useState, useEffect, useContext } from 'react';
import Alert from './Alert';
import { SocketContext } from '../Context/SocketContext';
import { Modal, Form, Button } from 'react-bootstrap';
import FadeIn from './fade-in';
import '../styles/ComponentCSS.css';

const getScale = (windowWidth, imageWidth) => {
  return ((windowWidth * 0.85) / 2) / imageWidth;
}

const randomString = (min, max) => {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  let id = '';
  let size = Math.random() * (max - min) + min;
  for (let i = 0; i < size; i++) 
    id += chars[Math.floor(Math.random() * chars.length)];

  return `${id}`;
}

const LobbyItem = ({ index, setRoomName, setRole, lobbyData }) => {
  const { name, white, black, spectators } = lobbyData;

  const handleNameClick = () => {
    setRoomName(name);

    if (white === 1 && black === 0) setRole('Black');
    if (white === 0 && black === 1) setRole('White');
    if (white === 1 && black === 1) setRole('Spectator');
  }

  return (
    <FadeIn>
      <div className={`border border-dark rounded mx-2 ${ index % 2 === 1 ? 'bg-primary' : 'bg-secondary' }`}>
        <div className="p-2">
          <strong className="text-dark">Room Name: </strong>
          <button className="btn btn-primary btn-sm" onClick={handleNameClick}>{name}</button>
          <p className="m-0 text-dark">White: {white}/1</p>
          <p className="m-0 text-dark">Black: {black}/1</p>
          <p className="m-0 text-dark">Spectators: {spectators}</p>
        </div>
      </div>
    </FadeIn>
  )
}

const SelectRoom = ({ setSetupState, opponent, windowWidth }) => {
  const [show, setShow] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [lobbies, setLobbies] = useState([]);

  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [role, setRole] = useState('White');

  const { socket } = useContext(SocketContext);
  
  const handleUsername = (event) => setUsername(event.target.value);
  const handleRoomName = (event) => setRoomName(event.target.value);
  const handleRole = (event) => setRole(event.target.value);

  const handleBack = () => {
    setSetupState(0);
    setShow(false);
  }

  const handleJoin = (event) => {
    event.preventDefault();
    let name = (username === '') ? randomString(6, 10):username;
    let room = (roomName === '') ? randomString(6, 10):roomName;

    socket.emit('join room', name, room, role, function (responseData) {
      setUsername(name);
      setAlerts(responseData.responses);
      if (responseData.status === 'Success') {
        setDisabled(true);
        setTimeout(() => {
          setSetupState(2);
        }, 1000)
      }
    });
  }

  useEffect(() => {
    const updateLobbies = (data) => setLobbies(data);

    socket.on('Update Lobbies', updateLobbies);

    socket.emit('Get Lobbies');

    return () => socket.removeListener('Update Lobbies', updateLobbies);
  }, [socket]);

  useEffect(() => {
    if (alerts.length > 0) {
      let timer = setTimeout(() => {
        setAlerts([]);
      }, 5000)

      return clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <>
      <Modal dialogClassName={getScale(windowWidth, 504) < 0.70 ? "":"width-70"} show={show} backdrop="static" keyboard={false} animation={false} centered>
        <div className="row no-gutters">
          <form className="col" onSubmit={handleJoin}>
            <Modal.Header>
              <Modal.Title>Join A Game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <input type="text" className="form-control mb-3" value={username} placeholder={"Username"} onChange={handleUsername} disabled={disabled} />
              <input type="text" className="form-control mb-3" value={roomName} placeholder={"Room Name"} onChange={handleRoomName} disabled={disabled}/>
              <Form.Label>Select A Role</Form.Label>
              <Form.Control className="mb-3" as="select" value={role} onChange={handleRole} disabled={disabled}>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Spectator">Spectator</option>
              </Form.Control>

              { alerts.map((value, index) => {
                return <Alert key={index} status={value.type} message={value.msg} />
              })}
            </Modal.Body>
            
            <Modal.Footer>
              <Button variant="secondary" type="Submit" onClick={handleBack} disabled={disabled}>Back</Button>
              <Button variant="primary" type="Submit" disabled={disabled}>Join</Button>
            </Modal.Footer>
          </form>
          <div className="col border-left border-dark">
            <Modal.Header>
              <Modal.Title>Room List</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              { lobbies.length === 0 ? <h3>No Lobbies Currently Open</h3>:
                lobbies.map((lobby, index) => {
                  return <LobbyItem key={index} index={index} setRoomName={setRoomName} setRole={setRole} lobbyData={lobby}/>
                })
              }
            </Modal.Body>
          </div>
        </div>

      </Modal>
    </>
  );
}

export default SelectRoom;