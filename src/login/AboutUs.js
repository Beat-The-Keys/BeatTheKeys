import React from 'react'
import { CardDeck, Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

export default function AboutUs({changeIsLoggedIn}) {
    const cards = [
        {
            img: 'img',
            title: 'AJ Ong',
            text: 'bio',
            link: 'https://github.com/Aj-Ong'
        },
        {
            img: 'akash.jpg',
            title: 'Akash Patel',
            text: 'I am a ReactJS Developer, currently a Senior studying. I like to play games and listen to music, I want to pursue a career in Front-end using ReactJS. One of my achievements is, I am a self-taught ReactJS Programmer, and really great at debugging code.',
            link: 'https://github.com/AP7557'
        },
        {
            img: 'img',
            title: 'Yusef Mustafa',
            text: 'bio',
            link: 'https://github.com/yusefmustafa'
        },
        {
            img: 'img',
            title: 'Mann Patel',
            text: 'bio',
            link: 'https://github.com/mmmann12'
        }
    ]
    return (
        <div>
            <Back onClick={()=>changeIsLoggedIn('Login')}>Back</Back>
            <Deck>
            {cards.map(card=>(
                <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={card.img} />
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
    margin-right: 0px;
    margin-left: 0px;
`;
const Title = styled(Card.Title)`
    margin-bottom: 10px;
    text-align: center;
`;
const Body = styled(Card.Body)`
    padding: 0px 5px 10px;
`;
const Back = styled(Button)`
    margin: 20px 50px 40px;
`;