import { React, useState, useEffect } from 'react';
import { socket } from './App';
import JoinToast from './JoinToast.js'


export default function GamePage({userName,room}) {
  const [Join, setJoin] = useState(false)
   useEffect(()=>{
      socket.emit('send', {userName, room, msg:"hello"})
      socket.on('send', (data)=>{
          console.log(data)
      })
      socket.on('joinRoom', (data)=>{
        console.log(Join)
        console.log("hello", data)
        setJoin(data.join)
        console.log(Join)
      })
    }, [])
  return (
    <div>
      The Game
      {Join && <JoinToast userName={userName}/>}
    </div>
  );
}