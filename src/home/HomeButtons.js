import React from 'react'
import {GoogleLogout} from 'react-google-login';
import Button from 'react-bootstrap/Button';
import {client_id, socket} from '../LoginScreen';
import JoinGameButton from './JoinGameButton';

export default function HomeButtons({playerName, responseGoogleLogout, startGame, room}) {
    return (
        <div className="flexC">
            <Button className="flexI" onClick={startGame} variant="success" size="lg">Start Game</Button>
            <JoinGameButton playerName={playerName} room={room} socket={socket}/>
            <Button className="flexI" variant="warning" size="lg">Achievements</Button>
            <GoogleLogout
            clientId={client_id}
            buttonText="Logout"
            onFailure={()=>responseGoogleLogout(room)}
            onLogoutSuccess={()=>responseGoogleLogout(room)
            }
            />
        </div>
    )
}
