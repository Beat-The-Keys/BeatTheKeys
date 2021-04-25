import { React, useState, useEffect } from 'react';
import UserList from './UserList.js';
import MainGameScreen from './MainGameScreen.js';
import PlayerStats from './PlayerStats.js';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeScreen.css';
import IconPick from './IconPick';
import {GoogleLogout} from 'react-google-login';
import {socket, client_id} from './LoginScreen';
import JoinGameButton from './JoinGameButton';

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
      <div className = "logged-in-status">
        <p>Logged In: {playerEmail} </p>
      </div>
      { playerStartedGame
      ? <div>
          {allPlayersFinished &&
          <div>
          <button onClick={goBackToLobby}>Back to Lobby</button>
          <h3>{winningPlayer} is the winner! Please go back to the lobby.</h3>
          </div>
          }
          <MainGameScreen playerName={playerName} room={room}/>
          <PlayerStats room={room} socket={socket}/>
        </div>
      : <div>
          <h2>Hi, {playerName}! Welcome to your lobby. Your invite code is {room}</h2>
          Current players:
          <UserList users={activePlayers}/>
          <center> <h1> BEAT THE KEYS! </h1> </center>
          <div className="gridC">
              <div className="flexC" id="gridI">
                <Button className="flexI" onClick={startGame} variant="success" size="lg">Start Game</Button>
                <JoinGameButton playerName={playerName} room={room} socket={socket}/>
                <Button className="flexI" variant="warning" size="lg">Achievements</Button>
                <GoogleLogout
                  clientId={client_id}
                  buttonText="Logout"
                  onFailure={()=>responseGoogleLogout(room)}
                  onLogoutSuccess={()=>responseGoogleLogout(room)
                  }
                />
            </div>
            <div id="gridI">
              <IconPick/>
            </div>
          </div>
        </div>
      }
    </div>
  );
}