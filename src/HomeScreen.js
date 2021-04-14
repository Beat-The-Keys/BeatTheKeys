import { React, useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from './UserList.js'
import MainGameScreen from './MainGameScreen.js';
import PlayerStats from './PlayerStats.js'

export const socket = io(); // Connects to socket connection

export default function Home ({playerName}) {
  const [playerJoinedMultiplayer, setPlayerJoinedMultiplayer] = useState(false)
  const [activePlayers, setActivePlayers] = useState([])
  const room = 'Multiplayer'

  useEffect(() => {
    socket.emit('joinRoom', {'playerName': playerName, 'room': room});
    socket.on('joinRoom', (data) => {
      setActivePlayers(data.users);
    })
  }, [])

  return (
    <div>
      { playerJoinedMultiplayer 
      ? <div>
          <MainGameScreen playerName={playerName} socket={socket} room={room}/>   
          <PlayerStats socket={socket}/>
        </div>
      : <div>
          Hi, {playerName}! Welcome to your lobby.
          <br></br>
          Current players: 
          <UserList users={activePlayers}/>
          <button onClick={() => setPlayerJoinedMultiplayer(true)}> Join Game </button>
        </div>
      }
    </div>
  );
}