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


export default function Home ({playerName, playerEmail, responseGoogleLogout}) {
  const [playerStartedGame, setPlayerStartedGame] = useState(false); // State for joining multiplayer room or not
  const [activePlayers, setActivePlayers] = useState([]); // State list of all players in all the rooms
  const [room, setRoom] = useState(""); // State for keeping track of the room the player is in
  const [allPlayersFinished, setAllPlayersFinished] = useState(false); // State for checking if all users finished the game

  function startGame() {
    setPlayerStartedGame(true);
    setAllPlayersFinished(false);
    socket.emit('startGame', {room});
  }

  function goBackToLobby() {
    setPlayerStartedGame(false);
    socket.emit('goBackToLobby', {room});
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
    });
    socket.on('gameComplete', (data) => {
      setAllPlayersFinished(true);
    });
    socket.on('goBackToLobby', (data) => {
      setPlayerStartedGame(false);
    });
 
  }, [playerName, room]);

  return (
    <div>
      <div className = "logged-in-status">
        <p>Logged In: {playerEmail} </p>
      </div>
      { playerStartedGame
      ? <div>
          {allPlayersFinished && <button onClick={goBackToLobby}>Back to Home Screen</button>}
          <MainGameScreen playerName={playerName} room={room}/>
          <PlayerStats room={room} socket={socket}/>
        </div>
      : <div>
         
          <h2>Hi, {playerName}! Welcome to your lobby.</h2>
          Current players:
          <UserList users={activePlayers}/>
          <center> <h1> BEAT THE KEYS! </h1> </center>
          <div className="gridC">
              <div className="flexC" id="gridI">
                <Button className="flexI" onClick={startGame} variant="success" size="lg">Start Game</Button>
                <Button className="flexI" variant="danger" size="lg">Join Game</Button>
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