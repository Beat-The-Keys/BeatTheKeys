import React from 'react'
import styled from 'styled-components';
import UserList from './UserList.js';
import HomeButtons from './HomeButtons.js';
import {Container, Row, Col} from 'react-bootstrap'
import Leaderboard from './Leaderboard.js';
import {socket} from '../LoginScreen';

export default function Home({prop}) {
    
    socket.emit('leaderboard', {'sortBy': 'bestwpm'}); // when the leaderboard is first rendered
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <HomeButtons prop={prop}/>
                </Col>
                <Col>
                    <Leaderboard prop={prop}/>
                </Col>
                <Col md="auto"><Middle>Current players: <UserList prop={prop}/></Middle></Col>
            </Row>
        </Container>
    )
}

const Middle = styled.div`
    display:flex;
    align-items:center;
    justify-content: center;
    margin-top: 20px;
    flex-direction:column
`;
// const GridContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   @media (max-width:615px){
//     display:flex;
//     flex-direction:column-reverse
//   }
// `;