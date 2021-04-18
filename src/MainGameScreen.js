import React, { useRef, useState, useEffect} from 'react';
import ReactTimer from "@xendora/react-timer";
import './MainGameUI.css';
import {socket} from './LoginScreen'

const prompt = "One study examining 30 subjects, of varying different styles and expertise, has found minimal difference in typing speed between touch typists and self-taught hybrid typists. According to the study, 'The number of fingers does not determine typing speed... People using self-taught typing strategies were found to be as fast as trained typists... instead of the number of fingers, there are other factors that predict typing speed... fast typists... keep their hands fixed on one position, instead of moving them over the keyboard, and more consistently use the same finger to type a certain letter.' To quote doctoral candidate Anna Feit: 'We were surprised to observe that people who took a typing course, performed at similar average speed and accuracy, as those that taught typing to themselves and only used 6 fingers on average' (Wikipedia)";

function MainGameScreen({playerName, room}) {
  const textboxRef = useRef(); // Input box reference for when user types
  const [highlightedStopIndex, setHighlightedStopIndex] = useState(0); // State for keeping track of the last character index to highlight in the prompt
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
      socket.emit('updatePlayerStats', {'playerName': playerName, 'wpm': wpm, 'room': room});
    }
  }, [highlightedStopIndex, playerName, room, timeLeft, playerFinished])

  function onTextChanged() {
    // Called when user starts typing
    setTypingBegan(true);
    if (prompt === textboxRef.current.value) {
      setPlayerFinished(true);
      socket.emit('playerFinished', {'playerName': playerName, 'room': room});
    }
    if (prompt.startsWith(textboxRef.current.value)) {
      setHighlightedStopIndex(textboxRef.current.value.length);
    }
  }

  function promptJSX() {
    // Highlight the text
    return (<p><b>{prompt.substring(0, highlightedStopIndex)}</b>{prompt.substring(highlightedStopIndex)}</p>);
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
        {time => <span>TIMER: {time}</span>}
      </ReactTimer>);
    }
    // Otherwise, if the player is not finished then we are at the start of the game.
    if (!playerFinished) {
      return <p>Begin typing: </p>;
    }
  }

  function handleTime(t) {
    if (t === 0) {
      socket.emit('playerFinished', {'playerName': playerName, 'room': room});
      setPlayerFinished(true)
    }
    // Decrement the timer and set the timeLeft state
    setTimeLeft(t);
    return t-1;
  }

  return (
    <div className="App">
      <div className = "topright">
        <p>Logged In: {playerName} </p>
      </div>
      <div className="grid-container">
        <div className="Prompt">
          {promptJSX()}
        </div>
        <div className="bar">
          <div className="Wpm">
            <p>WPM: {wpm}</p>
          </div>
        </div>
        <div className="Text-box">
          {gameStateJSX()}
        <div>
          <input type="text" name="name" ref={textboxRef} onChange={onTextChanged} />
        </div>
        </div>
      </div>
    </div>
  );
}

export default MainGameScreen;