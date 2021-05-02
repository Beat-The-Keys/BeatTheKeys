import React, { useRef, useState, useEffect} from 'react';
import ReactTimer from "@xendora/react-timer";
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
      socket.emit('updatePlayerStats', {playerEmail, wpm, room});
    }

  }, [highlightedStopIndex, playerName, room, timeLeft, playerFinished]);

  function onTextChanged() {
    // Called when user starts typing
    setTypingBegan(true);
    if (prompt === textboxRef.current.value) {
      setPlayerFinished(true);
      socket.emit('playerFinished', {'playerName': playerName, 'room': room, 'wpm': wpm, 'playerEmail': playerEmail});
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
    return (<p className="prompt-text">
              <b style={{color:'green'}}>{prompt.substring(0, highlightedStopIndex)}</b>
              <b style={{color:'red'}}>{prompt.substring(highlightedStopIndex, incorrectHighlight)}</b>
              {prompt.substring(incorrectHighlight)}
            </p>);
  }

  function gameStateJSX() {
    // If the user began typing and the game isn't over yet, display the timer only.
    if (typingBegan && !playerFinished) {
      return (
      <ReactTimer
        start={60}
        end={t => t === 0}
        onTick={t => handleTime(t)}
      >
        {time => <span>TIMER: {time}<br/></span>}
      </ReactTimer>);
    }
    // Otherwise, if the player is not finished then we are at the start of the game.
    if (!playerFinished) {
      return <p>Begin typing: </p>;
    }
  }

  function handleTime(t) {
    // Decrement the timer and set the timeLeft state
    setTimeLeft(t);
    if (t === 1) {

      socket.emit('playerFinished', {playerName, room, wpm, playerEmail});
      setPlayerFinished(true);
    }
    return t-1;
  }

  return (
      <GridContainer>
        <GirdItem>
          {promptJSX()}
          {gameStateJSX()}
          <Input type="text" disabled={playerFinished} name="name" ref={textboxRef} onChange={onTextChanged} />
        </GirdItem>
        <GirdItem>
          <p>WPM: {wpm}</p>
          <PlayerStats room={room}/>
        </GirdItem>
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

const GirdItem = styled.div`
  padding: 40px;
`;

const Input = styled.textarea`
 overflow: hidden;
 padding: 12px 20px;
 resize: none;
 margin-left: 30px;
 border: 1px solid;
 &:focus{
  background-color: lightblue;
 }
`;
