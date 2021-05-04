import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { LandingPageRow } from './LoginScreen.js';

export default function Guide() {
    return (
        <div id="Guide">
        <br></br><br></br>
        <h1 style={{'marginLeft':'15px', 'paddingLeft': '15px'}}>Guide</h1>
          <LandingPageRow md={3}>
            <Col><h5 style={{'color':'white'}}>Login Screen:</h5>
            <p style={{'color':'white'}}>Users can login through Google OAuth and navigate to our 
               landing page through the nav bar on top by clicking on the 
               corresponding sections they choose to view.</p></Col>
            <Col ><h5 style={{'color':'white'}}>Home Screen:</h5>
            <p style={{'color':'white'}}> Users can do various things on our home screen. It includes of 3 main buttons, 
                'Start Game', 'Join Game', 'Achievements'. In order to start the game, the ready 
                up button should be checked off. In order to join a game, each user's home screen 
                display's an invite code on the top left which can be shared with one another to initiate 
                the multiplayer aspect. Achievements can simply be viewed by clicking the button which will 
                redirect the user to a new screen. Additionals include of the leaderboard which can be sorted 
                by clicking on the drop down button and an icon picker which is accessed by clicking on the 
                current player's name. </p></Col>
            <Col><h5 style={{'color':'white'}}>Main Game:</h5>
            <p style={{'color':'white'}}>Users are introduced with a prompt, chart, input box, and a timer. Once the user starts 
               typing the timer begins and the chart updates dynamically  every keyword typed. The timer 
               lasts 60 seconds and depending on if it is a multiplayer or singleplayer game, the winner's 
               name will be displayed accordingly. </p></Col>
          </LandingPageRow>
        <br></br>
        </div>
    )
}
