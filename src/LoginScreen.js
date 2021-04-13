import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import MainGameScreen from './MainGameScreen.js';

export function Login(){
  const [isLoggedIn, changeIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  
  function responseGoogle(response){
    console.log(response);
    console.log(response.profileObj);
    setName(response.profileObj.name);
    changeIsLoggedIn(true);
  }
  
  if(!isLoggedIn){
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
  if(isLoggedIn){ // this is where we will render main menu component
      return (
        <MainGameScreen name={name}/> // for now, just render the main game after logging in
      );
  }
}

export default Login;
