import React from 'react'
import Button from 'react-bootstrap/Button';
import {socket} from '../LoginScreen';
import JoinGameButton from './JoinGameButton';
import styled from 'styled-components';


export default function HomeButtons({prop}) {
    const {room, playerName, originalRoom, startGame, playerEmail} = prop[0]

    function rejoinOriginalLobby() {
        socket.emit('attemptToJoinGame', {playerName, oldRoom:room, newRoom: originalRoom, playerEmail})
    }

    return (
        <FlexContainer>
            <FlexItem onClick={startGame} variant="success" size="lg">Start Game</FlexItem>

            <JoinGameButton playerName={playerName} room={room} socket={socket} playerEmail={playerEmail}/>

            { room !== originalRoom && <FlexItem onClick={rejoinOriginalLobby} variant="danger" size="lg">Leave Lobby</FlexItem>}
            <FlexItem variant="warning" size="lg">Achievements</FlexItem>
        </FlexContainer>
    )
}


const FlexContainer = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
`;

export const FlexItem = styled(Button)`
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  height: 100px;
  @media (max-width:420px){
    width: 200px;
    height: auto;
  }
`;