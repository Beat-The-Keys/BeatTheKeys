import React,{useEffect, useRef } from 'react';
import {socket} from '../login/LoginScreen'
import { Bar } from "react-chartjs-2";
import styled from 'styled-components';

const colorGenerator = ()=>{
  const red = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, 0, ${blue}, 0.5)`;
}
var config = {
  data: {
    labels: [],
    datasets: [{
      label: "WPM",
      data: [],
      fill: false,
      backgroundColor: []
    }]
  },
  };
const PlayerStats = React.memo(({room}) => {
  const barChart = useRef(null)

  useEffect(() => {
    socket.on('updatePlayerStats', (data) => {
      if(barChart.current){
        Object.entries(data.playerStats).map((key, index) => {
          console.log(key, key[0], key[1][0])
          if(barChart.current.data.labels.indexOf(key[0]) === -1){
            barChart.current.data.labels.push(key[0]);
            barChart.current.data.datasets[0].backgroundColor.push(colorGenerator())
          }
          barChart.current.data.datasets[0].data[index] = key[1][0];
          barChart.current.update();
          return null;
        })
      }
    });
    socket.on('playersFinished', (data) => {
      if(barChart.current){
        const len = data.playersFinished.length;
        const index = barChart.current.data.labels.indexOf(data.playersFinished[len-1])
        console.log(len, index, data.playersFinished[len-1])
        console.log(barChart.current.data.datasets[0].backgroundColor)
        barChart.current.data.datasets[0].backgroundColor[index] = "rgb(0,255,0)"
        barChart.current.update();
      }
    });

  }, [room, barChart]);

  return (
    <BarChart ref={barChart} data={config.data}/>
  );
});

export default PlayerStats;

const BarChart = styled(Bar)`
  @media (min-width:960px){
    display: block;
    box-sizing: border-box;
    height: 198px;
    width: 397.7px;
  }
`;