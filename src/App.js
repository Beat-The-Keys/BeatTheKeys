import logo from './logo.svg';
import { React, useState, useEffect } from 'react';
import './App.css';
import Multiplayer from './Multiplayer.js'

function App() {
  const [joinMulti, isJoinMulti] = useState(false)
  return (
    <div className="App">
      {joinMulti
          ? <Multiplayer userName="Akash"/>
          : <button onClick={()=>isJoinMulti(true)}>Join Game</button>
      }

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
