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
    console.log(response);
    console.log(response.profileObj);
    setPlayerName(response.profileObj.name);
    changeIsLoggedIn(true);
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
        <center> <h1> BEAT THE KEYS! <Emoji emoji='keyboard' set='twitter' size={40} /> </h1>  </center>
        <center> <h5> "Multiplayer typeracing" </h5> </center>
        <div class="form">
          <form class="login-form">
            <meta name="google-signin-client_id" content={client_id}/>
                <GoogleLogin
                buttonText="Login"
                clientID={client_id}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                />
          </form>
        </div>
        <center> <h5> Features coming soon: <br/>"Private lobbies, achievements, etc.." </h5> </center>
        </div>
    }
    </div>
  );
}