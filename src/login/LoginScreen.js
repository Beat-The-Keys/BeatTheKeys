import React, { useState } from 'react';
import {GoogleLogin} from 'react-google-login';
import HomeScreen from '../home/HomeScreen.js';
import io from 'socket.io-client';
import styled, { keyframes }from "styled-components";
import AboutUs from './AboutUs';
import Guide from './Guide';
import Why from './Why'

export const socket = io(); // Connects to socket connection
export const client_id = "658534926731-idi9s66r9j41tj2o844e16s5q4ua1d06.apps.googleusercontent.com";

export default function LoginScreen (){
  const [isLoggedIn, changeIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [guideUs, setGuideUs] = useState('about');

  function responseGoogle(response){
    setPlayerName(response.profileObj.givenName); // changed it to first name only
    let email = response.profileObj.email;
    setPlayerEmail(email);
    changeIsLoggedIn(true);
    let name = response.profileObj.name;
    socket.emit('login', {email, name});
  }
  function responseGoogleLogout(room){
    changeIsLoggedIn(false);
    socket.emit('removePlayerFromLobby', {playerEmail, room});
  }

  return (
    <Background>
    {isLoggedIn
      ? <HomeScreen playerName={playerName} playerEmail={playerEmail} responseGoogleLogout={responseGoogleLogout}/>
      : <div>
          <Loginpage>
            <Title data-text="BEAT_THE_KEYS!">BEAT_THE_KEYS!</Title>
            <img src = 'https://img.icons8.com/ios/452/keyboard.png' alt="Loading Keyboard" width="50" height="50" />
            <Para> Multiplayer typeracing game </Para>
            <Form>
            <Popin>Join game:</Popin>
            <meta name="google-signin-client_id" content={client_id}/>
            <GoogleLogin
            buttonText="Login"
            clientID={client_id}
            onSuccess={responseGoogle}
            onFailure={() => alert('Please try logging in again.')}
            cookiePolicy={'single_host_origin'}
            />
            </Form>
            <h6>Find out how fast can u type, can you beat all the achievements? Join today and become the top of everyone.</h6>
          </Loginpage>
          <BottomNav>
            <div onClick={()=>setGuideUs('guide')}> Guide </div>
            <div onClick={()=>setGuideUs('why')}> Why </div>
            <div onClick={()=>setGuideUs('about')}> About Us </div>
            </BottomNav>
            {guideUs === 'guide' ? <Guide/> :
              guideUs === 'why' ? <Why/> :
              <AboutUs/>}
        </div>
    }

    </Background>
  );
}

const Background = styled.div`
  height:100vh;
  overflow-y:auto;
  background-image: linear-gradient(to bottom right, yellow, red );
`;

const Loginpage = styled.div`
  width: max-content;
  margin: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Form = styled.div`
  position: relative;
  z-index: 1;
  background-repeat: repeat;
  max-width: 360px;
  margin: 0 auto 20px;
  padding: 20px 100px;
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

const Para = styled.p`
  border-right: solid 5px;
  white-space: nowrap;
  overflow: hidden;
  font-family: Trebuchet MS, sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  color: Black;
  margin-top: 0;
  margin-bottom: 0.2;
  animation: ${textAnimation} 2s linear 1s 1 normal both,
             ${textCursor} 1200ms linear infinite;
`;


const animate = keyframes`
    0% ,10%,100%{
        width: 0;
    }
    70%,90%{
        width: 100%;
    }
`;

const Title = styled.p`
  position: relative;
  font-size: 5vw;
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 0;
  -webkit-text-stroke: 0.15vw #000000;
  text-transform: uppercase;
  ::before {
    content: attr(data-text);
    position: absolute;
    top:0;
    left:0;
    width: 0;
    height: 100%;
    color: #ff0000;
    -webkit-text-stroke: 0.1vw #000000;
    border-right: #ff0000;
    overflow: hidden;
    animation: ${animate} 6s linear infinite;
  }
`;

const animatePOP = keyframes`
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
`;

const Popin = styled.p`
  text-align: center;
  font-family: Trebuchet MS, sans-serif;
  font-size: 20px;
  color: #000000;
  margin-bottom: 0.5rem;
  animation: ${animatePOP} 2s ease-in-out;
`
const fadeIn = keyframes`
    0% {
    opacity: 0;
    top: 100px;
    }
    75% {
      opacity: 0.5;
      top: 0px;
    }
    100% {
      opacity: 1;
    }
`;

const Rise = styled.ul`
  color: #000000;
  font-family: Trebuchet MS, sans-serif;
  position: relative;
  margin-bottom: 15px;
  animation: ${fadeIn} 2s linear;
`

const BottomNav = styled.nav`
  display: flex;
  bottom: 0;
  justify-content: space-around;
  position: fixed;
  width: 100%;
  z-index: 2;
  div{
    margin: 0 auto 20px;
    background-image: linear-gradient(to bottom right, yellow, red );
    padding: 20px 100px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    border-radius: 10px;
    cursor: pointer;
    @media (max-width:550px){
      padding: 20px 50px;
    }
  }
`