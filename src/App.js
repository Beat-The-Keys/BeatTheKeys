import React, { useRef, useState, useEffect} from 'react';
import ReactTimer from "@xendora/react-timer";
import './App.css';
import Home from './Home.js'
import io from 'socket.io-client';
export const socket = io(); // Connects to socket connection

const prompt = "One study examining 30 subjects, of varying different styles and expertise, has found minimal difference in typing speed between touch typists and self-taught hybrid typists. According to the study, 'The number of fingers does not determine typing speed... People using self-taught typing strategies were found to be as fast as trained typists... instead of the number of fingers, there are other factors that predict typing speed... fast typists... keep their hands fixed on one position, instead of moving them over the keyboard, and more consistently use the same finger to type a certain letter.' To quote doctoral candidate Anna Feit: 'We were surprised to observe that people who took a typing course, performed at similar average speed and accuracy, as those that taught typing to themselves and only used 6 fingers on average' (Wikipedia)";

function App() {

  const textboxRef = useRef();
  const [highlightedStopIndex, setHighlightedStopIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [typingBegan, setTypingBegan] = useState(false);

  useEffect(() => {
    let entries = highlightedStopIndex / 5;
    let currentMin = (60 - timeLeft) / 60;
    let wpm = currentMin === 0 ? 0 : Math.round(entries / currentMin);
    setWpm(wpm);
  }, [highlightedStopIndex, timeLeft])

  function onTextChanged() {
    setTypingBegan(true);
    if (prompt.startsWith(textboxRef.current.value)) {
      setHighlightedStopIndex(textboxRef.current.value.length);
    }
  }

  function promptJSX() {
    return (<p><b>{prompt.substring(0, highlightedStopIndex)}</b>{prompt.substring(highlightedStopIndex)}</p>);
  }

  function handleTime(t) {
    setTimeLeft(t);
    return t-1;
  }

  return (
    <div className="App">
    
      <Home userName="Akash"/>
    
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

export default App;
