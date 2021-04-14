import React, { useRef, useState, useEffect} from 'react';
import ReactTimer from "@xendora/react-timer";
import {socket} from './HomeScreen'

const prompt = "One study examining 30 subjects, of varying different styles and expertise, has found minimal difference in typing speed between touch typists and self-taught hybrid typists. According to the study, 'The number of fingers does not determine typing speed... People using self-taught typing strategies were found to be as fast as trained typists... instead of the number of fingers, there are other factors that predict typing speed... fast typists... keep their hands fixed on one position, instead of moving them over the keyboard, and more consistently use the same finger to type a certain letter.' To quote doctoral candidate Anna Feit: 'We were surprised to observe that people who took a typing course, performed at similar average speed and accuracy, as those that taught typing to themselves and only used 6 fingers on average' (Wikipedia)";

function MainGameScreen({playerName, room}) {
  //input box when user types
  const textboxRef = useRef();
  //state for highlighting text to bold
  const [highlightedStopIndex, setHighlightedStopIndex] = useState(0);
  //state for calculating wpm
  const [wpm, setWpm] = useState(0);
  //sate for calculating time for wpm
  const [timeLeft, setTimeLeft] = useState(60);
  //state for when typing gets stated and stopped
  const [typingBegan, setTypingBegan] = useState(false);

  useEffect(() => {
    //calculate wpm and set it in the state
    let entries = highlightedStopIndex / 5;
    let currentMin = (60 - timeLeft) / 60;
    let wpm = currentMin === 0 ? 0 : Math.round(entries / currentMin);
    setWpm(wpm);
    socket.emit('playerStats', {'playerName': playerName, 'wpm': wpm, 'room': room});
  }, [highlightedStopIndex, playerName, room, timeLeft])

  function onTextChanged() {
    //called when user starts typing
    setTypingBegan(true);
    if (prompt.startsWith(textboxRef.current.value)) {
      setHighlightedStopIndex(textboxRef.current.value.length);
    }
  }

  function promptJSX() {
    //highlight the text
    return (<p><b>{prompt.substring(0, highlightedStopIndex)}</b>{prompt.substring(highlightedStopIndex)}</p>);
  }

  function handleTime(t) {
    //calculate the time
    setTimeLeft(t);
    return t-1;
  }

  return (
    <div className="App">
      <h1>Welcome, {playerName} </h1>
      <div className="Prompt">
        {promptJSX()}
      </div>
      <div className="Wpm">
        <p>WPM: {wpm}</p>
      </div>
      {typingBegan ?
        <ReactTimer
          start={60}
          end={t => t === 0}
          onTick={t => handleTime(t)}
        >
          {time => <span>TIMER: {time}</span>}
        </ReactTimer>
        : <p>Begin typing: </p>
      }
      <div>
        <input type="text" name="name" ref={textboxRef} onChange={onTextChanged}/>
      </div>
    </div>
  );
}

export default MainGameScreen;