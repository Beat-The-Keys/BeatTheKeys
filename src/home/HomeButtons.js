import React from 'react'
import Button from 'react-bootstrap/Button';
import {socket} from '../login/LoginScreen';
import JoinGameButton from './JoinGameButton';
import styled from 'styled-components';


export default function HomeButtons({prop}) {
    const {room, playerName, originalRoom, startGame, playerEmail, startDisabled, viewAchievements, gameInProgress} = prop[0]

    function rejoinOriginalLobby() {
        socket.emit('attemptToJoinGame', {playerName, oldRoom:room, newRoom: originalRoom, playerEmail})
    }

    return (
        <FlexContainer>
            <ButtonStart disabled={startDisabled || gameInProgress} onClick={startGame} variant="success" size="lg">{gameInProgress ? "Game in-progress" : "Start Game"}</ButtonStart>

            <JoinGameButton playerName={playerName} room={room} socket={socket} playerEmail={playerEmail}/>

            { room !== originalRoom && <ButtonLeave onClick={rejoinOriginalLobby} variant="danger" size="lg">Leave Lobby</ButtonLeave>}
            <ButtonAchievements onClick={viewAchievements} >Achievements</ButtonAchievements>
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

export const ButtonAchievements = styled.button`
  background: #ffc107;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  height: 100px;
  border: none;
  color: #000000;
  text-align: center;
  font-size: 20px;
  transition: all 0.5s;
  cursor: pointer;
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
  :after {
  content: '🏆';
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
  right: 115px;
  }
`

export const ButtonStart = styled(Button)`
  background-color: #28a745;
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
  background-color: #28a745;
  padding-right: 24px;
  padding-left:8px;
  }
  :hover:after {
  opacity: 1;
  right: 125px;
  }
`

export const ButtonLeave = styled.button`
  background-color: #dc3545;
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
  content: '🚪🚶';
  position: absolute;
  opacity: 0;  
  top: 35px;
  left: -20px;
  transition: 0.5s;
  }
  :hover{
  padding-left: 24px;
  padding-right:8px;
  }
  :hover:after {
  opacity: 1;
  left: 110px;
  }
`
