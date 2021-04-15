import React, { useState,  useEffect } from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import HomeScreen from './HomeScreen.js';
import io from 'socket.io-client';

export const socket = io(); // Connects to socket connection
const client_id = "427706489011-6rshj7squ73369r4n830rl8cch7q86f2.apps.googleusercontent.com"

export default function LoginScreen (){
  const [isLoggedIn, changeIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState("");

  function responseGoogle(response){
    console.log(response);
    console.log(response.profileObj);
    setPlayerName(response.profileObj.name);
    changeIsLoggedIn(true);
  }
  function responseGoogleLogout(){
    changeIsLoggedIn(false);
    socket.emit('logout', {playerName});
  }

  useEffect(() => {
    socket.on('logout', (data)=>{
      console.log(data)
    })

  }, [])

  if (!isLoggedIn) {
    return (
    <div>
      <meta name="google-signin-client_id" content={client_id}/>
      <GoogleLogin
      clientID={client_id}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      />

    </div>
    );
  }
  if (isLoggedIn) { // This is where we will render main menu component
      return (
        <div>
          <GoogleLogout
          clientId={client_id}
          buttonText="Logout"
          onFailure={responseGoogleLogout}
          onLogoutSuccess={responseGoogleLogout}
          />
          <HomeScreen playerName={playerName}/>
        </div>
      );
  }
}