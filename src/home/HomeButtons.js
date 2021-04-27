import React from 'react'
import {GoogleLogout} from 'react-google-login';
import Button from 'react-bootstrap/Button';
import {client_id, socket} from '../LoginScreen';
import JoinGameButton from './JoinGameButton';
import styled from 'styled-components';

export default function HomeButtons({playerName, responseGoogleLogout, startGame, room}) {
    return (
        <FlexContainer>
            <FlexItem onClick={startGame} variant="success" size="lg">Start Game</FlexItem>
            <JoinGameButton playerName={playerName} room={room} socket={socket}/>
            <FlexItem variant="warning" size="lg">Achievements</FlexItem>
            <GoogleLogout
            clientId={client_id}
            buttonText="Logout"
            onFailure={()=>responseGoogleLogout(room)}
            onLogoutSuccess={()=>responseGoogleLogout(room)
            }
            />
        </FlexContainer>
    )
}


const FlexContainer = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
`;

export const FlexItem = styled(Button)`
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  height: 100px;
  @media (max-width:420px){
    width: auto;
    height: auto;
  }
`;