import { React, useState, useEffect } from 'react';
import { socket } from './App';
import JoinToast from './JoinToast.js'
import UserList from './UserList.js'
import MainGameScreen from './MainGameScreen.js';

export default function Multiplayer({userName,room}) {
  const [join, setJoin] = useState(false)
  const [users, setUsers] = useState([])
   useEffect(()=>{
     socket.emit('send', {userName, room, msg:"hello"})
      socket.on('send', (data)=>{
          console.log(data)
      })
      socket.on('joinRoom', (data)=>{
        console.log("hello", data)
        setUsers(data.users)
        setJoin(true)
      })
    }, [room, userName])
  return (
    <div>
      The Game
      <br/><br/>
      <UserList users={users}/>
      {join && <JoinToast userName={userName}/>}
      <MainGameScreen name={userName}/>
    </div>
  );
}