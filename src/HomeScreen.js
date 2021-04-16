import { React, useState, useEffect } from 'react';
import UserList from './UserList.js'
import MainGameScreen from './MainGameScreen.js';
import PlayerStats from './PlayerStats.js'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeScreen.css';
import IconPick from './IconPick';
import {GoogleLogout} from 'react-google-login';
import {socket, client_id} from './LoginScreen'


export default function Home ({playerName, responseGoogleLogout}) {
  const [playerStartedGame, setPlayerStartedGame] = useState(false) // State for joining multiplayer room or not
  const [activePlayers, setActivePlayers] = useState([]) // State list of all players in all the rooms
  const [room, setRoom] = useState(""); // State for keeping track of the room the player is in

  useEffect(() => {
    socket.emit('assignPlayerToLobby', {playerName, room});
    socket.on('assignPlayerToLobby', (data) => {
      setActivePlayers(data.activePlayers);
      setRoom(data.room)
    })
  }, [playerName,room])

  return (
    <div>
      <GoogleLogout
        clientId={client_id}
        buttonText="Logout"
        onFailure={()=>responseGoogleLogout(room)}
        onLogoutSuccess={()=>responseGoogleLogout(room)}
        />
      { playerStartedGame
      ? <div>
          <button onClick={() => setPlayerStartedGame(false)}>Back to Home Screen</button>
          <MainGameScreen playerName={playerName} room={room}/>
          <PlayerStats socket={socket}/>
        </div>
      : <div>
          Hi, {playerName}! Welcome to your lobby.
          <br></br>
          Current players:
          <UserList users={activePlayers}/>
          <center> <h1> BEAT THE KEYS! </h1> </center>
          <div className="gridC">
              <div className="flexC" id="gridI">
                <Button className="flexI" onClick={() => setPlayerStartedGame(true)} variant="success" size="lg">Start Game</Button>
                <Button className="flexI" variant="danger" size="lg">Join Game</Button>
                <Button className="flexI" variant="warning" size="lg">Achievements</Button>
                <button className="flexI" class="button">Logout</button>
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
