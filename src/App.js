import { React } from 'react';
import './App.css';
import Home from './Home.js'
import io from 'socket.io-client';
export const socket = io(); // Connects to socket connection


function App() {

  return (
    <div className="App">
      <Home userName="Akash"/>
    </div>
  );
}

export default App;
