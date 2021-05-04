import React, { useRef, useState, useEffect} from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import {socket} from '../login/LoginScreen';
import PlayerStats from '../game/PlayerStats.js';
import styled from 'styled-components';

function MainGameScreen({prompt, playerName, room, playerEmail}) {
  const textboxRef = useRef(); // Input box reference for when user types
  const [highlightedStopIndex, setHighlightedStopIndex] = useState(0); // State for keeping track of the last correct character index to highlight in the prompt(green)
  const [incorrectHighlight, setIncorrectHighlight] = useState(0); // State for keeping track of the last incorrect character index to highlight in the prompt(red)
  const [wpm, setWpm] = useState(0); // State for calculating wpm
  const [timeLeft, setTimeLeft] = useState(60); // State for keeping track of the time so that the wpm can be calculated
  const [typingBegan, setTypingBegan] = useState(false); // State for checking if the user started typing
  const [playerFinished, setPlayerFinished] = useState(false); // State for checking if the user finished the game

  useEffect(() => {
    if (!playerFinished) {
      let entries = highlightedStopIndex / 5;
      let currentMin = (60 - timeLeft) / 60;
      let wpm = currentMin === 0 ? 0 : Math.round(entries / currentMin);
      setWpm(wpm);

      socket.emit('updatePlayerStats', {playerEmail, wpm, room, playerName});
    }

  }, [highlightedStopIndex, playerName, room, timeLeft, playerFinished]);

  function onTextChanged() {
    // Called when user starts typing
    setTypingBegan(true);
    if (prompt === textboxRef.current.value) {
      setPlayerFinished(true);
      socket.emit('playerFinished', {playerName, room, wpm, playerEmail});
    }
    if (prompt.startsWith(textboxRef.current.value)) {
      setHighlightedStopIndex(textboxRef.current.value.length);
      setIncorrectHighlight(textboxRef.current.value.length)
    }else{
      setIncorrectHighlight(textboxRef.current.value.length)
    }
  }

  function promptJSX() {
    // Highlight the text
    return (<Prompt>
              <p style={{backgroundColor:'#5cb85c', display:'inline'}}>{prompt.substring(0, highlightedStopIndex)}</p>
              <p style={{backgroundColor:'#d9534f', display:'inline'}}>{prompt.substring(highlightedStopIndex, incorrectHighlight)}</p>
              <p style={{ display:'inline'}}>{prompt.substring(incorrectHighlight)}</p>
            </Prompt>);
  }

  function timerJSX() {
      return (
        <div>
          <center>
          <CountdownCircleTimer
            size={150}
            isPlaying={typingBegan && !playerFinished}
            duration={60}
            colors={'#0275d8'}
            onComplete={timerFinished}
            >
            {({ remainingTime }) => "Time left: " + handleTime(remainingTime) + "s"}
          </CountdownCircleTimer>
          </center>
        </div>
      );
  }

  function handleTime(t) {
    setTimeLeft(t);
    return t;
  }

  function timerFinished() {
    socket.emit('playerFinished', {playerName, room, wpm, playerEmail});
    setPlayerFinished(true);
  }

  return (
      <GridContainer>
        <GridItem>
          {promptJSX()}
          <WPM> WPM: {wpm} </WPM>
          <Input type="text" placeholder="Start typing..." disabled={playerFinished} name="name" ref={textboxRef} onChange={onTextChanged} />
        </GridItem>
        <GridItem>
          {timerJSX()}
          <PlayerStats room={room}/>
        </GridItem>
      </GridContainer>
  );
}

export default MainGameScreen;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 51%;
  gap: 0px 0px;
  @media (max-width:960px){
    display: flex;
    flex-direction: column;
  }
`;

const GridItem = styled.div`
  padding: 40px;
`;

const Input = styled.textarea`
 overflow: hidden;
 padding: 12px 20px;
 resize: none;
 margin-top: 20px;
 width: 100%;
 border: 1px solid;
 border-radius: 10px;
 &:focus{
  background-color: lightblue;
 }
`;

const WPM = styled.div`
  font-size: 2rem;
  font-weight: 200;
  text-align: center;
  margin: auto;
`

const Prompt = styled.div`
  font-family: DejaVu Sans Mono, monospace;
`