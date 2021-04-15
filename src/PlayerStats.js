import { React, useState, useEffect } from 'react';

export default function PlayerStats ({socket}) {
  const [activePlayerStats, setActivePlayerStats] = useState({}) // State to keep track of all the active users wpm

  useEffect( ()=> {
    socket.on('updatePlayerStats', (data) => {
      setActivePlayerStats(data.playerStats);
    })
  }, [])

  return ( // We can eventually replace this with a chart
    <ul>
      { Object.entries(activePlayerStats).map(([key, index]) => {
        return <li key={key}><b>{key}:</b> {activePlayerStats[key]}</li>
      })}
    </ul>
  );
}