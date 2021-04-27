import { React, useState, useEffect } from 'react';
import {socket} from '../LoginScreen'
export default function PlayerStats ({room}) {
  const [activePlayerStats, setActivePlayerStats] = useState({}); // State to keep track of all the active users wpm
  const [playersFinished, setPlayersFinished] = useState([]); // State to keep track of which players finished
  const highlightStyle = {color: 'green'};

  useEffect(() => {
    socket.on('updatePlayerStats', (data) => {
      setActivePlayerStats(data.playerStats);
    });
    socket.on('playersFinished', (data) => {
      setPlayersFinished(data.playersFinished);
    });
  }, [socket]);

  return ( // We can eventually replace this with a chart
    <ul>
      { Object.entries(activePlayerStats).map(([key, index]) => {
        return (
          <li style={playersFinished.includes(key) ? highlightStyle : {}} key={key}><b>{key}:</b> {activePlayerStats[key]} WPM</li>
        );
      })}
    </ul>
  );
}