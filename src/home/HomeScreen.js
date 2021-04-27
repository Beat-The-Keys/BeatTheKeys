import { React, useState, useEffect } from 'react';
import UserList from './UserList.js';
import MainGameScreen from '../game/MainGameScreen.js';
import IconPick from './IconPick';
import {socket} from '../LoginScreen';
import HomeButtons from './HomeButtons.js';
import styled from 'styled-components';

export default function Home ({playerName, playerEmail, responseGoogleLogout}) {
  const [playerStartedGame, setPlayerStartedGame] = useState(false); // State for joining multiplayer room or not
  const [activePlayers, setActivePlayers] = useState([]); // State list of all players in all the rooms
  const [room, setRoom] = useState(""); // State for keeping track of the room the player is in
  const [allPlayersFinished, setAllPlayersFinished] = useState(false); // State for checking if all users finished the game
  const [winningPlayer, setWinningPlayer] = useState(); // State which holds the winning player name

  function startGame() {
    setPlayerStartedGame(true);
    setAllPlayersFinished(false);
    setWinningPlayer(null);
    socket.emit('startGame', {room});
  }

  function goBackToLobby() {
    setPlayerStartedGame(false);
    socket.emit('goBackToLobby', {room});
    socket.emit('login', {name:playerName, email:playerEmail});
  }

  useEffect(() => {
    socket.emit('assignPlayerToLobby', {playerName, room});
    socket.on('assignPlayerToLobby', (data) => {
      setActivePlayers(data.activePlayers);
      setRoom(data.room);
    });
    socket.on('startGame', () => {
      setPlayerStartedGame(true);
      setAllPlayersFinished(false);
      setWinningPlayer(null);
    });
    socket.on('gameComplete', (data) => {
      setAllPlayersFinished(true);
      setWinningPlayer(data.winningPlayer);
    });
    socket.on('goBackToLobby', (data) => {
      setPlayerStartedGame(false);
    });

  }, [playerName, room, playerEmail]);

  return (
    <div>
        <LoggedIn>Logged In: {playerEmail} </LoggedIn>
      { playerStartedGame
      ? <div>
          {allPlayersFinished &&
          <Winner>
            <button onClick={goBackToLobby}>Back to Lobby</button>
            <h3>{winningPlayer} is the winner! Please go back to the lobby.</h3>
          </Winner>
          }
          <MainGameScreen playerName={playerName} room={room}/>
        </div>
      : <div>
      <H2>Hi, {playerName}! Welcome to your lobby. Your invite code is {room}</H2>
      Current players: <UserList users={activePlayers}/>
          <center> <h1> BEAT THE KEYS! </h1> </center>
          <GridContainer>
            <HomeButtons room={room} startGame={startGame} responseGoogleLogout={responseGoogleLogout}/>
            <IconPick/>
          </GridContainer>
        </div>
      }
    </div>
  );
}

const LoggedIn = styled.p`
  position: absolute;
  top: 8px;
  right: 5px;
  font-size: 18px;
  z-index:1
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width:615px){
    display:flex;
    flex-direction:column-reverse
  }
`;

const H2 = styled.h2`
  @media (max-width:718px){
    display:none;
  }
`;

const Winner = styled.div`
 display:flex;
 flex-direction:column;
 width: 20%;
  button{
    background-color: crimson;
    border-radius: 10px;
    border: none;
    color: white;
    padding: 5px;
    text-align: center;
    font-size: 20px;
    margin: 4px 2px;
    cursor: pointer;
  }
  h3{
    align-self:center;
    font-size:20px;
  }
`;