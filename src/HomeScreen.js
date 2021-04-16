import { React, useState, useEffect } from 'react';
import UserList from './UserList.js'
import MainGameScreen from './MainGameScreen.js';
import PlayerStats from './PlayerStats.js'
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
          <button onClick={() => setPlayerStartedGame(true)}> Start Game </button>
        </div>
      }
    </div>
  );
}