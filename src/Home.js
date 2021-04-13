import { React, useState, useEffect } from 'react';
import { socket } from './App';
import GamePage from './GamePage.js'

export default function Home({userName}) {
    const [joinMulti, isJoinMulti] = useState(false)
    const room = 'Multiplayer'
    console.log("Home", userName)
  return (
    <div>
      {joinMulti
          ? <GamePage userName="Akash" room={room}/>
          : <div> "Home Page"
            <br/>
            <button onClick={()=>{
              socket.emit('joinRoom', {userName, room, join:true})
              isJoinMulti(true)}}>Join Game</button>
            </div>
      }
    </div>
  );
}