import './App.css';
import { Login } from './LoginScreen.js';
import io from 'socket.io-client';
export const socket = io(); // Connects to socket connection

function App() {

  return (
    <Login/>
  );
}

export default App;
