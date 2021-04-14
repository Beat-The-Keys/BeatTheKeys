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

  const leaveRoom = ()=>{
    socket.emit('leaveRoom', {playerName, room})
    setPlayerJoinedMultiplayer(false)
  }

  const joinRoom = ()=>{
    socket.emit('joinRoom', {playerName, room})
    setPlayerJoinedMultiplayer(true)
  }
  useEffect(() => {
    socket.emit('getUsers', {playerName})
    socket.on('getUsers', (data)=>{
      setActivePlayers(data);
    })
  }, [playerName])

  return (
    <div>
      { playerJoinedMultiplayer
      ? <div>
          <button onClick={leaveRoom}>Back to Home-Screen</button>
          <MainGameScreen playerName={playerName} socket={socket} room={room}/>
          <PlayerStats socket={socket}/>
        </div>
      : <div>
          Hi, {playerName}! Welcome to your lobby.
          <br></br>
          Current players:
          <UserList users={activePlayers}/>
          <button onClick={joinRoom}> Join Game </button>
        </div>
      }
    </div>
  );
}