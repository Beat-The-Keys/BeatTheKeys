import { React, useState, useEffect } from 'react';
import {Toast, ToastBody} from 'react-bootstrap';
import { socket } from './App';

export default function Multiplayer({userName,room}) {
    // const [showToast, setToast]


   useEffect(()=>{
      socket.emit('send', {userName, room, msg:"hello"})
      console.log('test')
      socket.on('send', (data)=>{
          console.log(data)
      })
      socket.on('joinRoom', (data)=>{
        console.log("hello", data)
      })
    }, [])
  return (
    <div>
      Hey
    </div>
  );
}