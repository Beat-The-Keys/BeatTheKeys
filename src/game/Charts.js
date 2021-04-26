import React, {useEffect, useRef, useState} from 'react'
import { Bar } from "react-chartjs-2";
import styled from 'styled-components';
import { socket } from "../LoginScreen";

var config = {
    type:'bar',
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: "My First dataset",
      data: [65, 0, 80, 81, 56, 85, 40],
      fill: false
    }]
  },
};


export default function Charts({room}) {
    const barChart = useRef(null)
    const [activePlayerStats, setActivePlayerStats] = useState({}); // State to keep track of all the active users wpm
    const [playersFinished, setPlayersFinished] = useState([]); // State to keep track of which players finished
    const highlightStyle = {color: 'green'};

    useEffect(() => {

      socket.on('updatePlayerStats', (data) => {
        console.log(data)
        setActivePlayerStats(data.playerStats);
      });
      const interval = setInterval(() => {
            console.log(barChart.current)
            barChart.current.data.datasets[0].data[Math.floor(Math.random() * 6)] = Math.floor(Math.random() * 200);
            barChart.current.update();
        }, 1000);
        return () => {
          clearInterval(interval)
        }
    }, [])

    return (
        <BarChart ref={barChart} data={config.data}></BarChart>
    )
}

const BarChart = styled(Bar)`
  @media (min-width:960px){
    display: block;
    box-sizing: border-box;
    height: 198px;
    width: 397.7px;
  }
`;