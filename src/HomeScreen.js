import { React, useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserList from './UserList.js'
import MainGameScreen from './MainGameScreen.js';
import PlayerStats from './PlayerStats.js'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeScreen.css';

export const socket = io(); // Connects to socket connection

export default function Home ({playerName}) {
  //state for joining multiplayer room or not
  const [playerJoinedMultiplayer, setPlayerJoinedMultiplayer] = useState(false)
  //state list of all players in all the rooms
  const [activePlayers, setActivePlayers] = useState([])
  const room = 'Multiplayer'

  const leaveRoom = ()=>{
    //when someone clicks the leave room button
    socket.emit('leaveRoom', {playerName, room})
    setPlayerJoinedMultiplayer(false)
  }

  const joinRoom = ()=>{
    //when someone clicks the join room button
    socket.emit('joinRoom', {playerName, room})
    setPlayerJoinedMultiplayer(true)
  }
  useEffect(() => {
    //get all the active users from all the room
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
          <MainGameScreen playerName={playerName} room={room}/>
          <PlayerStats />
        </div>
      : <div>
          Hi, {playerName}! Welcome to your lobby.
          <br></br>
          Current players:
          <UserList users={activePlayers}/>
          <center> <h1> BEAT THE KEYS! </h1> </center>
          <table width="40%">
            <tbody>
            <tr>
              <td> <center> <button onClick={joinRoom} type="button" class="btn btn-success">Join Game</button> </center> </td>
            </tr>
            <tr>
              <td> <center> <button type="button" class="btn btn-primary">Invite Players</button> </center> </td>
            </tr>
            <tr>
              <td> <center> <button type="button" class="btn btn-danger">Play Solo</button> </center> </td>
            </tr>
            <tr>
              <td> <center> <button type="button" class="btn btn-warning">Achievements</button> </center> </td>
            </tr>
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}