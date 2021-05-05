import { React, useState, useRef } from 'react';
import { Modal, FormControl} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {FlexItem} from './HomeButtons';
import styled from 'styled-components';

export default function JoinGameButton({playerName, room, socket, playerEmail}) {


    const [showJoinGameModal, setShowJoinGameModal] = useState(false);
    const [alreadyInRoomError, setAlreadyInRoomError] = useState(false);
    const joinGameTextBoxRef = useRef(null);

    function handleJoinGame() {
        if (joinGameTextBoxRef.current.value === "") {
            setShowJoinGameModal(false);
            return;
        }
        if (joinGameTextBoxRef.current.value === room) {
            setAlreadyInRoomError(true);
            return;
        }

        socket.emit('attemptToJoinGame', {playerName, oldRoom:room, newRoom: joinGameTextBoxRef.current.value, playerEmail})

        setShowJoinGameModal(false);
    }

    return (
        <div>
            <ButtonJoin onClick={() => setShowJoinGameModal(true)} variant="info" size="lg">Join Game</ButtonJoin>
            <Modal
            onShow={() => setAlreadyInRoomError(false)}
            onHide={() => setShowJoinGameModal(false)}
            show={showJoinGameModal}
            backdrop="static"
            keyboard={false}
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    {alreadyInRoomError ? "You are already in that room" : "Enter an Invite Code" }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl ref={joinGameTextBoxRef}
                placeholder="ex: 1234"
                aria-label="Invite Code"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowJoinGameModal(false)}>Close</Button>
                <Button variant="primary" onClick={handleJoinGame}>Join Game</Button>
            </Modal.Footer>
            </Modal>
        </div>
    );
}

export const ButtonJoin = styled.button`
  border-radius: 4px;
  background-color: #17a2b8;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  height: 100px;
  border: none;
  color: #fff;
  text-align: center;
  font-size: 20px;
  transition: all 0.5s;
  cursor: pointer;
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
  :after {
  content: '⌨️';
  position: absolute;
  opacity: 0;  
  top: 36px;
  right: -20px;
  transition: 0.5s;
  }
  :hover{
  padding-right: 25px;
  padding-left:8px;
  }
  :hover:after {
  opacity: 1;
  right: 130px;
  }
`