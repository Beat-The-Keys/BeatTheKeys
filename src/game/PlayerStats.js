import { React, useState, useEffect, useRef } from 'react';
import {socket} from '../LoginScreen'
import { Bar } from "react-chartjs-2";

export default function PlayerStats ({room}) {
  const [activePlayerStats, setActivePlayerStats] = useState({}); // State to keep track of all the active users wpm
  const [playersFinished, setPlayersFinished] = useState([]); // State to keep track of which players finished
  const highlightStyle = {color: 'green'};
  const barChart = useRef(null)

  const config = {
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [{
        label: "My First dataset",
        data: [0,0,0,0,0,0,0],
        fill: false
      }]
    },
  };

  useEffect(() => {
    const updateBar = ()=>{
      console.log(activePlayerStats)
    }
    socket.on('updatePlayerStats', (data) => {
      setActivePlayerStats(data.playerStats);
      updateBar();
    });
    socket.on('playersFinished', (data) => {
      setPlayersFinished(data.playersFinished);
    });
    console.log(activePlayerStats)
    Object.entries(activePlayerStats).map((key, index) => {
        console.log('here')
        barChart.current.data.datasets[0].data[index] = activePlayerStats[key]
        return barChart.update()
    })
  }, [activePlayerStats, updateBar]);
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
    <Bar ref={barChart} data={config.data}></Bar>
    </ul>
  );
}