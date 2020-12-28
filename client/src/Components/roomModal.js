import React, { useState, useEffect, useContext } from 'react';
import Alert from './Alert';
import { SocketContext } from '../Context/SocketContext';
import { Modal, Form, Button } from 'react-bootstrap';
import FadeIn from '../Animations/fade-in';
import withWindowDimensions from '../Service/WindowSizeService';
import './ComponentCSS.css';

const getScale = (windowWidth, imageWidth) => {
  let scale = ((windowWidth * 0.85) / 2) / imageWidth;

  if (scale > 0.75) 
    return scale;
  else
    return 0.75;
}

const LobbyItem = ({ index, lobbyData }) => {
  const { name, white, black, spectators } = lobbyData;
  return (
    <FadeIn>
      <div className={`border border-dark rounded mx-2 ${ index % 2 === 1 ? 'bg-primary' : 'bg-secondary' }`}>
        <div className="p-2">
          <strong className="text-white">Room Name: {name}</strong>
          <p className="m-0">White: {white}/1</p>
          <p className="m-0">Black: {black}/1</p>
          <p className="m-0">Spectators: {spectators}</p>
        </div>
      </div>
    </FadeIn>
  )
}

const SelectRoom = ({ setSetupState, username, setUsername, roomName, setRoomName, role, setRole, opponent, windowWidth }) => {
  const [show, setShow] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [lobbies, setLobbies] = useState([]);
  const handleUsername = (event) => setUsername(event.target.value);
  const handleRoomName = (event) => setRoomName(event.target.value);
  const handleRole = (event) => setRole(event.target.value);
  const { socket } = useContext(SocketContext);

  const handleBack = () => {
    setSetupState(0);
    setShow(false);
  }

  const handleJoin = (event) => {
    event.preventDefault();
    let name = username;

    if (name === '') {
      let chars = '0123456789'.split('');
      let id = '';
      for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) 
        id += chars[Math.floor(Math.random() * chars.length)];

      name = `User${id}`;
    }

    socket.emit('join room', name, roomName, role, function (responseData) {
      if (responseData.status === 'Success') {
        setDisabled(true);
        setTimeout(() => {
          setSetupState(2);
          setUsername(name);
        }, 1000)
      }
      setAlerts(responseData.responses);
    });

  }

  useEffect(() => {
    if (alerts.length > 0) {
      let timer = setTimeout(() => {
        setAlerts([]);
      }, 5000)

      return () => clearTimeout(timer);
    }

    socket.on('Update Lobbies', (data) => {
      setLobbies(data);
    });

    socket.emit('Get Lobbies');
  }, [socket, alerts])

  return (
    <>
      <Modal dialogClassName={getScale(windowWidth, 504) === 0.75 ? "" : "modal-join"} show={show} backdrop="static" keyboard={false} animation={false} centered>
        <div className="row no-gutters">
          <form className="col" onSubmit={handleJoin}>
            <Modal.Header>
              <Modal.Title>Join A Game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <input type="text" className="form-control mb-3" value={username} placeholder={"Username"} onChange={handleUsername} disabled={disabled}/>
              <input type="text" className="form-control mb-3" value={roomName} placeholder={"Room Name"} onChange={handleRoomName} disabled={disabled}/>
              <Form.Label>Select A Role</Form.Label>
              <Form.Control className="mb-3" as="select" onChange={handleRole} disabled={disabled}>
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
                  return <LobbyItem key={index} index={index} lobbyData={lobby}/>
                })
              }
            </Modal.Body>
          </div>
        </div>

      </Modal>
    </>
  );
}

export default withWindowDimensions(SelectRoom);