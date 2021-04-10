import { React, useState, useEffect, useRef } from 'react';
// import './styles/App.css';
import io from 'socket.io-client';

export const socket = io(); // Connects to socket connection

function App() {
  const user = useRef(null);
  const msg = useRef(null);

  const [mssg, setMssg] = useState('')

  const joinRoom = ()=>{
    // let newroom = user.current.value
    // socket.emit('leave', {room:user.})
    socket.emit('create', {room: user.current.value});
  }
  useEffect(()=>{
    socket.on('create', (data)=>{
      setMssg(prev=>prev+data.msg+"\n")
      console.log("hello", data)
    })
  })
  return (
    <div>
      <input ref={user}></input>
      <button onClick={joinRoom}>Submit</button>

      <input ref={msg}></input>
      <button onClick={mssg}>Submit</button>

      <li>{mssg}</li>
      <h1>End</h1>

    </div>
  );
}

export default App;
