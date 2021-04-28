import React, { useState } from 'react';
import {GoogleLogin} from 'react-google-login';
import HomeScreen from './home/HomeScreen.js';
import io from 'socket.io-client';
import { Emoji } from 'emoji-mart'
import styled, { keyframes }from "styled-components";

export const socket = io(); // Connects to socket connection
export const client_id = "427706489011-6rshj7squ73369r4n830rl8cch7q86f2.apps.googleusercontent.com";

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
    socket.emit('login', {name, email});
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
          <Title>BEAT THE KEYS!</Title>
          <Emoji emoji='keyboard' set='twitter' size={40}/>
          <h5> Multiplayer typeracing game </h5>
          <Form>
            <h5>Join game:</h5>
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

const textAnimation = keyframes`
  from{width: 0;}
  to{width: 265px;}
`;

const textCursor = keyframes`
  from{border-right-color: black;}
  to{border-right-color: transparent;}
`;

const Title = styled.p`
  border-right: solid 5px;
  white-space: nowrap;
  overflow: hidden;    
  font-family: Trebuchet MS, sans-serif;
  font-weight: 550;
  font-size: 35px;
  color: Black;
  animation: ${textAnimation} 2s linear 1s 1 normal both,
             ${textCursor} 800ms linear infinite;
`;


