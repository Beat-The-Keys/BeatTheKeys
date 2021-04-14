import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import HomeScreen from './HomeScreen.js';

export default function LoginScreen (){
  const [isLoggedIn, changeIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState("");

  function responseGoogle(response){
    console.log(response);
    console.log(response.profileObj);
    setPlayerName(response.profileObj.name);
    changeIsLoggedIn(true);
  }

  if (!isLoggedIn) {
    return (
    <div>
      <meta name="google-signin-client_id" content="427706489011-6rshj7squ73369r4n830rl8cch7q86f2.apps.googleusercontent.com"/>
      <GoogleLogin
      clientID="427706489011-6rshj7squ73369r4n830rl8cch7q86f2.apps.googleusercontent.com"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      />
    </div>
    );
  }
  if (isLoggedIn) { // This is where we will render main menu component
      return (
        <HomeScreen playerName={playerName}/>
      );
  }
}