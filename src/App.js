import logo from './logo.svg';
import { React, useState, useEffect } from 'react';
import './App.css';
import Home from './Home.js'
import io from 'socket.io-client';
export const socket = io(); // Connects to socket connection


function App() {

  return (
    <div className="App">
      <Home userName="Akash"/>

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
