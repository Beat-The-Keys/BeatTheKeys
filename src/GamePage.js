import { React, useState, useEffect } from 'react';
import { socket } from './App';
import JoinToast from './JoinToast.js'


export default function GamePage({userName,room}) {
  const [Join, setJoin] = useState(false)
   useEffect(()=>{
    // setJoin(false)
      socket.emit('send', {userName, room, msg:"hello"})
      socket.on('send', (data)=>{
          setJoin(false)
          console.log(data)
      })
      socket.on('joinRoom', (data)=>{
        console.log(Join)
        console.log("hello", data)
        setJoin(true)
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