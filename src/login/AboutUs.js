import React from 'react'
import { CardDeck, Card } from 'react-bootstrap'
import styled from 'styled-components'

export default function AboutUs() {
    const cards = [
        {
            img: 'aj.png',
            title: 'AJ Ong',
            text: 'I am a senior at NJIT studying Computing and Business and will be graduating in December 2021. I have really enjoy working on projects using ReactJS, Python, and HTML/CSS. I fell in love with web development and am searching for opportunities where I can use my skills and grow as a developer.',
            link: 'https://github.com/Aj-Ong'
        },
        {
            img: 'akash.jpg',
            title: 'Akash Patel',
            text: 'I am into ReactJS Development, currently a Senior studying. I like to play games and listen to music, I want to pursue a career in Front-end using ReactJS. One of my achievements is, I am a self-taught ReactJS Programmer, and really great at debugging code.',
            link: 'https://github.com/AP7557'
        },
        {
            img: 'yusef.png',
            title: 'Yusef Mustafa',
            text: 'I am a senior at NJIT studying CS and a Pokémon nerd.',
            link: 'https://github.com/yusefmustafa'
        },
        {
            img: 'mann.jpg',
            title: 'Mann Patel',
            text: 'I am a senior majoring in Computer Science at NJIT and pursuing a career in front-end development. I enjoy listening to hip-hop and gaming in my spare time.',
            link: 'https://github.com/mmmann12'
        }
    ]
    return (
        <div id="AboutUs">
        <br></br><br></br>
        <h1 style={{'marginLeft':'15px', 'paddingLeft': '15px'}}>About Us</h1>
        <Deck>
            {cards.map(card=>(
                <Card text="dark" order="info" style={{ width: '18rem' }}>
                <Img variant="top" src={card.img} />
                <Title>{card.title}</Title>
                <Body>
                <Card.Text>
                    {card.text}
                </Card.Text>
                <Card.Link href={card.link} target="_blank">Github</Card.Link>
                </Body>
                </Card>
            ))}
        </Deck>
        </div>
    )
}


const Deck = styled(CardDeck)`
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 50px;
    background-color: #007bff;
    padding-top: 15px;
    padding-bottom: 15px;
    border-radius: 10px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
`;
const Title = styled(Card.Title)`
    margin-bottom: 10px;
    text-align: center;
    color: black;
`;
const Body = styled(Card.Body)`
    padding: 0px 5px 10px;
    color: black;
`;
const Img = styled(Card.Img)`
    width: 100%;
    height: 20vw;
    object-fit: cover;
`;