import { React, useState, useEffect } from 'react';
import MainGameScreen from '../game/MainGameScreen.js';
import {socket} from '../login/LoginScreen';
import styled from 'styled-components';
import Header from './Header.js';
import Home from './Home.js';
import Button from 'react-bootstrap/Button';
import Achievements from './Achievements.js'

export default function HomeScreen ({playerName, playerEmail, responseGoogleLogout}) {
  const [playerStartedGame, setPlayerStartedGame] = useState(false); // State for joining multiplayer room or not
  const [activePlayers, setActivePlayers] = useState({}); // State list of all players in all the rooms
  const [room, setRoom] = useState(""); // State for keeping track of the room the player is in
  const [originalRoom, setOriginalRoom] = useState(""); // State which contains the original room the player was assigned to
  const [allPlayersFinished, setAllPlayersFinished] = useState(false); // State for checking if all users finished the game
  const [winningPlayer, setWinningPlayer] = useState(); // State which holds the winning player name
  const [readyPlayers, setReadyPlayers] = useState([]); // State which holds the players that are ready to play
  const [startDisabled, setStartDisabled] = useState(true); // State which controls if the game can be started
  const [showAchievements, setShowAchievements] = useState(false); // State which controls if the player is viewing their achievements
  const [achievements, setAchievements] = useState({}); // State which contains a dictionary of achievements
  const [prompt, setPrompt] = useState(""); // State which contains the text prompt for all users in a lobby
  const [gameInProgress, setGameInProgress] = useState(false); // State for tracking if a game is in-progress

  function startGame() {
    setPlayerStartedGame(true);
    setAllPlayersFinished(false);
    setWinningPlayer(null);
    socket.emit('startGame', {room});
  }

  function viewAchievements() {
    setShowAchievements(true);
    socket.emit('playerAchievements', {'playerEmail': playerEmail});
  }

  function goBackToLobby() {
    setPlayerStartedGame(false);
    socket.emit('goBackToLobby', {room});
    console.log('here')
    socket.emit('login', {name:playerName, email:playerEmail});
  }

  function handleJSX() {
    if(playerStartedGame){
      return (
        <div>
          {allPlayersFinished &&
            <Container>
              <Button variant="info" onClick={goBackToLobby}>Back to Lobby</Button>
              {Object.keys(activePlayers).length === 1 ? null : <h5> {winningPlayer} is the winner! Please go back to the lobby. </h5>}
            </Container>
          }
          <MainGameScreen playerName={playerName} room={room} playerEmail={playerEmail} prompt={prompt}/>
        </div>
    )}else if(showAchievements){
      return(
        <div>
          <Container>
            <Button variant="info" onClick={()=>setShowAchievements(false)}>Back to Home</Button>
          </Container>
          <Achievements achievements={achievements}/>
        </div>
    )}else{
      return(
        <div>
        <Home prop={[{room, playerName, originalRoom, startGame, activePlayers, playerEmail, readyPlayers, startDisabled, viewAchievements, gameInProgress}]}/>
      </div>
      )}
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
      setGameInProgress(data.gameInProgress);
    });
    socket.on('startGame', (data) => {
      setPlayerStartedGame(true);
      setAllPlayersFinished(false);
      setWinningPlayer(null);
      setPrompt(data.prompt);
      setGameInProgress(true);
    });
    socket.on('gameComplete', (data) => {
      setAllPlayersFinished(true);
      setWinningPlayer(data.winningPlayer);
      setGameInProgress(false);
    });
    socket.on('goBackToLobby', () => {
      setPlayerStartedGame(false);
    });
    socket.on('playerChangedReady', (data) => {
      setReadyPlayers(data.readyPlayers);
      setStartDisabled(!data.allPlayersReady);
    });
    socket.on('playerAchievements', (data) => {
      setAchievements(data.achievements);
    });

  }, [playerName, room, playerEmail]);

  return (
    <div>
      <Header prop={[{room, playerName, playerEmail, responseGoogleLogout}]}></Header>
      {handleJSX()}
    </div>
  );
}

const Container = styled.div`
  display:flex;
  justify-content: space-around;
  margin-block: 10px;
`;