import { React, useState, useEffect } from 'react';
import { socket } from './App';
import Multiplayer from './Multiplayer.js'

export default function Home({userName}) {
    const [joinMulti, isJoinMulti] = useState(false)
    const room = 'Multiplayer'
    console.log("Home", userName)
  return (
    <div>
      {joinMulti
          ? <Multiplayer userName="Akash" room={room}/>
          : <button onClick={()=>{
                socket.emit('joinRoom', {userName, room})
                isJoinMulti(true)}}>Join Game</button>
      }
    </div>
  );
}
//   const joinRoom = ()=>{
//     // let newroom = user.current.value
//     // socket.emit('leave', {room:user.})
//     socket.emit('create', {room: user.current.value});
//   }
//   useEffect(()=>{
//     socket.on('create', (data)=>{
//       setMssg(prev=>prev+data.msg+"\n")
//       console.log("hello", data)
//     })
//   })
//   return (
//     <div>
//       <input ref={user}></input>
//       <button onClick={joinRoom}>Submit</button>

//       <input ref={msg}></input>
//       <button onClick={mssg}>Submit</button>

//       <li>{mssg}</li>
//       <h1>End</h1>

//     </div>
//   );
// }

// export default App;

