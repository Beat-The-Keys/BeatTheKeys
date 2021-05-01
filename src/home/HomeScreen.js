import { React, useState, useEffect } from 'react';
import MainGameScreen from '../game/MainGameScreen.js';
import {socket} from '../login/LoginScreen';
import styled from 'styled-components';
import Header from './Header.js';
import Home from './Home.js';
import Button from 'react-bootstrap/Button';

export default function HomeScreen ({playerName, playerEmail, responseGoogleLogout}) {
  const [playerStartedGame, setPlayerStartedGame] = useState(false); // State for joining multiplayer room or not
  const [activePlayers, setActivePlayers] = useState({}); // State list of all players in all the rooms
  const [room, setRoom] = useState(""); // State for keeping track of the room the player is in
  const [originalRoom, setOriginalRoom] = useState(""); // State which contains the original room the player was assigned to
  const [allPlayersFinished, setAllPlayersFinished] = useState(false); // State for checking if all users finished the game
  const [winningPlayer, setWinningPlayer] = useState(); // State which holds the winning player name
  const [readyPlayers, setReadyPlayers] = useState([]); // State which holds the players that are ready to play
  const [startDisabled, setStartDisabled] = useState(true); // State which controls if the game can be started

  function startGame() {
    setPlayerStartedGame(true);
    setAllPlayersFinished(false);
    setWinningPlayer(null);
    socket.emit('startGame', {room});
  }

  function goBackToLobby() {
    setPlayerStartedGame(false);
    socket.emit('goBackToLobby', {room});
    console.log('here')
    socket.emit('login', {name:playerName, email:playerEmail});
  }

  useEffect(() => {

    socket.emit('assignPlayerToLobby', {playerName, room, playerEmail});

    socket.on('assignPlayerToLobby', (data) => {
      console.log(data)
      setActivePlayers(data.activePlayers);
      if (data.isOriginalRoom) {
        setOriginalRoom(data.room);
      }
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
    socket.on('playerChangedReady', (data) => {
      setReadyPlayers(data.readyPlayers);
      setStartDisabled(!data.allPlayersReady);
    });

  }, [playerName, room, playerEmail]);

  return (
    <div>
      <Header prop={[{room, playerName, playerEmail, responseGoogleLogout}]}></Header>
      { playerStartedGame
      ? <div>
          {allPlayersFinished &&
            <Container>
              <Button variant="info" onClick={goBackToLobby}>Back to Lobby</Button>
              <h5>{winningPlayer} is the winner! Please go back to the lobby.</h5>
            </Container>
          }
          <MainGameScreen playerName={playerName} room={room} playerEmail={playerEmail}/>
        </div>
      : <div>
          <center> <h1> BEAT THE KEYS! </h1> </center>

          <Home prop={[{room, playerName, originalRoom, startGame, activePlayers, playerEmail, readyPlayers, startDisabled}]}/>
        </div>
      }
    </div>
  );
}

const Container = styled.div`
  display:flex;
  justify-content: space-around;
  margin-block: 10px;
`;