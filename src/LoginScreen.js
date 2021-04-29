import React, { useState } from 'react';
import {GoogleLogin} from 'react-google-login';
import HomeScreen from './home/HomeScreen.js';
import io from 'socket.io-client';
import { Emoji } from 'emoji-mart'
import styled from "styled-components";

export const socket = io(); // Connects to socket connection
export const client_id = "658534926731-idi9s66r9j41tj2o844e16s5q4ua1d06.apps.googleusercontent.com";

export default function LoginScreen (){
  const [isLoggedIn, changeIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");

  function responseGoogle(response){
    setPlayerName(response.profileObj.givenName); // changed it to first name only
    let email = response.profileObj.email;
    setPlayerEmail(email)
    changeIsLoggedIn(true);
    let name = response.profileObj.name;
    socket.emit('login', {name, email, room:''});
  }
  function responseGoogleLogout(room){
    changeIsLoggedIn(false);
    socket.emit('removePlayerFromLobby', {playerName, room});
  }

  return (
    <div>
    {isLoggedIn
      ? <HomeScreen playerName={playerName} playerEmail={playerEmail} responseGoogleLogout={responseGoogleLogout}/>
      : <Loginpage>
          <h1> BEAT THE KEYS!</h1>
          <Emoji emoji='keyboard' set='twitter' size={40}/>
          <h5> Multiplayer typeracing game </h5>
          <Form>
            <p>Join game:</p>
            <meta name="google-signin-client_id" content={client_id}/>
                <GoogleLogin
                buttonText="Login"
                clientID={client_id}
                onSuccess={responseGoogle}
                onFailure={() => alert('Please try logging in again.')}
                cookiePolicy={'single_host_origin'}
                />
          </Form>
          <h5>Features coming soon:</h5>
          <ul>
            <li>Private lobbies</li>
            <li>Achievements</li>
            <li>Leaderboard</li>
            <li>More text prompts</li>
          </ul>
        </Loginpage>
    }
    </div>
  );
}


const Loginpage = styled.div`
  width: max-content;
  padding: 8% 0 0;
  margin: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Form = styled.div`
  position: relative;
  z-index: 1;
  background: #dfdfdf;
  max-width: 360px;
  margin: 0 auto 20px;
  padding: 45px 100px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  border-radius: 10px;
`;