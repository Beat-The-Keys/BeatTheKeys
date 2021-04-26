import { React, useState, useEffect, useRef } from 'react';
import {socket} from '../LoginScreen'
import { Bar } from "react-chartjs-2";
import Charts from './Charts';

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

  }, [activePlayerStats]);
//   function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
//   }

//   function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
//   }


  return ( // We can eventually replace this with a chart
    <ul>
    {console.log("how many")}
    <Charts room={room} activePlayerStats={activePlayerStats}></Charts>
    </ul>
  );
}