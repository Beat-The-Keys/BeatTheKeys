import React from 'react'
import { Col } from 'react-bootstrap';
import { LandingPageRow } from './LoginScreen.js';

export default function Why() {
    return (
        <div id="Why">
        <br></br><br></br>
        <h1 style={{'marginLeft':'15px', 'paddingLeft': '15px'}}>What makes this different from other typeracers?</h1>
          <LandingPageRow md={3}>
            <Col><h5 style={{'color':'white'}}>Achievements:</h5>
            <p style={{'color':'white'}}>By replaying the game various times, users can 
               complete many achievements offered in our game. 
               This ensures players to come back to the game and 
               gives a sense of satisfaction through completion.   </p></Col>
            <Col ><h5 style={{'color':'white'}}>Competitive leaderboard:</h5>
            <p style={{'color':'white'}}> Beat the keys is a multiplayer game so including leaderboards 
                is a given. Users can compare their stats with others and compete 
                for better wpms! </p></Col>
            <Col><h5 style={{'color':'white'}}>Live graph:</h5>
            <p style={{'color':'white'}}> Wpm is key to our game and the addition of a dynamic graphs adds 
                to the enjoyment of the user. </p></Col>
          </LandingPageRow>
        <br></br>
        </div>
    )
}
