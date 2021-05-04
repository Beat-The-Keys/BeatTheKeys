import React from 'react'
import styled from 'styled-components';
import UserList from './UserList.js';
import HomeButtons from './HomeButtons.js';
import {Container, Row, Col} from 'react-bootstrap'
import Leaderboard from './Leaderboard.js';
import {socket} from '../login/LoginScreen.js';

export default function Home({prop}) {
    
    socket.emit('leaderboard', {'sort_query': 'bestwpm'}); // when the leaderboard is first rendered
    return (
        <HomeContainer>
            <Row md={3}>
                <Col>
                    <HomeButtons prop={prop}/>
                </Col>
                <Col><Middle>Current players: <UserList prop={prop}/></Middle></Col>
                <Col>
                    <Leaderboard prop={prop}/>
                </Col>
            </Row>
        </HomeContainer>
    )
}

const Middle = styled.div`
    font-size: 20px;
    display:flex;
    align-items:center;
    justify-content: center;
    color: black;
    flex-direction:column;
`;
// const GridContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   @media (max-width:615px){
//     display:flex;
//     flex-direction:column-reverse
//   }
// `;
const HomeContainer = styled.div`
    margin: auto;
    width: 100%;
    padding: 60px 30px;
`