import { React, useState, useEffect } from 'react';
import {socket} from './HomeScreen'

export default function PlayerStats () {
  //state to keep track of all the active users wpm
  const [activePlayerStats, setActivePlayerStats] = useState({})

  useEffect( ()=> {
    socket.on('playerStats', (data) => {
      setActivePlayerStats(data.playerStats);
    })
  }, [])

  return ( // We can eventually replace this with a chart
    <ul>
      { Object.entries(activePlayerStats).map(([key, index]) => {
        return <li key={index}><b>{key}:</b> {activePlayerStats[key]}</li>
      })}
    </ul>
  );
}