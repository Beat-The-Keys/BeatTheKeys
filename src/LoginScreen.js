import React, { useState } from 'react';
import {GoogleLogin} from 'react-google-login';
import HomeScreen from './HomeScreen.js';
import io from 'socket.io-client';
import './LoginUI.css';
import { Emoji } from 'emoji-mart'

export const socket = io(); // Connects to socket connection
export const client_id = "427706489011-6rshj7squ73369r4n830rl8cch7q86f2.apps.googleusercontent.com";

export default function LoginScreen (){
  const [isLoggedIn, changeIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState("");

  function responseGoogle(response){
    setPlayerName(response.profileObj.givenName); // changed it to first name only
    changeIsLoggedIn(true);
    let name = response.profileObj.name;
    let email = response.profileObj.email;
    socket.emit('login', {name, email});
  }
  function responseGoogleLogout(room){
    changeIsLoggedIn(false);
    socket.emit('removePlayerFromLobby', {playerName, room});
  }

  return (
    <div>
    {isLoggedIn
      ? <HomeScreen playerName={playerName} responseGoogleLogout={responseGoogleLogout}/>
      : <div class="login-page">
        <center>
        <h1> BEAT THE KEYS!</h1>
        <Emoji emoji='keyboard' set='twitter' size={40}/>
        <h5> Multiplayer typeracing game </h5>
        <div class="form">
          <form class="login-form">
            <p>Join game:</p>
            <meta name="google-signin-client_id" content={client_id}/>
                <GoogleLogin
                buttonText="Login"
                clientID={client_id}
                onSuccess={responseGoogle}
                onFailure={() => alert('Please try logging in again.')}
                cookiePolicy={'single_host_origin'}
                />
          </form>
        </div>
        <h5>Features coming soon:</h5>
        <ul>
          <li>Private lobbies</li>
          <li>Achievements</li>
          <li>Leaderboard</li>
          <li>More text prompts</li>
        </ul>
        </center>
        </div>
    }
    </div>
  );
}
