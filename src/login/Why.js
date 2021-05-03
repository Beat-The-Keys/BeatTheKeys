import React from 'react'
import { Row, Col } from 'react-bootstrap';

export default function Why() {
    return (
        <div id="Why">
        <br></br><br></br>
        <h1>What makes us different from other typeracers</h1>
          <Row md={3}>
            <Col><h5>Achievements:</h5>
            <p>By replaying the game various times, users can 
               complete many achievements offered in our game. 
               This ensures players to come back to the game and 
               gives a sense of satisfaction through completion.   </p></Col>
            <Col ><h5>Competitive leaderboard:</h5>
            <p> Beat the keys is a multiplayer game so including leaderboards 
                is a given. Users can compare their stats with others and compete 
                for better wpms! </p></Col>
            <Col><h5>Live graph:</h5>
            <p> Wpm is key to our game and the addition of a dynamic graphs adds 
                to the enjoyment of the user. </p></Col>
          </Row>
        <br></br>
        </div>
    )
}
