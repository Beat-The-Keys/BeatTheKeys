import { React, useState, useRef } from 'react';
import { Modal, FormControl} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default function JoinGameButton({playerName, room, socket}) {

    const [showJoinGameModal, setShowJoinGameModal] = useState(false);
    const [alreadyInRoomError, setAlreadyInRoomError] = useState(false);
    const joinGameTextBoxRef = useRef(null);

    function handleJoinGame() {
        if (joinGameTextBoxRef.current.value == "") {
            setShowJoinGameModal(false);
            return;
        }
        if (joinGameTextBoxRef.current.value == room) {
            setAlreadyInRoomError(true);
            return;
        }
        socket.emit('attemptToJoinGame', {playerName, oldRoom:room, newRoom: joinGameTextBoxRef.current.value})
        setShowJoinGameModal(false);
    }

    return (
        <div>
            <Button className="flexI" onClick={() => setShowJoinGameModal(true)} variant="danger" size="lg">Join Game</Button>
            <Modal
            onShow={() => setAlreadyInRoomError(false)}
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