import React,{useState, useEffect, useRef } from 'react';
import {socket} from '../LoginScreen'
import { Bar } from "react-chartjs-2";
import styled from 'styled-components';
var config = {
  data: {
    labels: [],
    datasets: [{
      label: "My First dataset",
      data: [],
      fill: false
    }]
  },
  };
const PlayerStats = React.memo(({room}) => {
  // const [playersFinished, setPlayersFinished] = useState([]); // State to keep track of which players finished
  // const highlightStyle = {color: 'green'};
  const barChart = useRef(null)

  useEffect(() => {
    if(barChart !== null){
    socket.on('getUpdatePlayerStats', (data) => {
      Object.entries(data.playerStats).map((key, index) => {
        if(barChart.current.data.labels.indexOf(key[0]) === -1){
          console.log(key[0])
          barChart.current.data.labels.push(key[0]);
        }
        barChart.current.data.datasets[0].data[index] = key[1];
        barChart.current.update();
        console.log(barChart.current.data)
        return null;
      })
    });
  }
    // socket.on('playersFinished', (data) => {
    //   setPlayersFinished(data.playersFinished);
    // });
    const interval = setInterval(() => {
      socket.emit('getUpdatePlayerStats', {room})
    }, 1000);


    return () => {
      clearInterval(interval)
    }

  }, [room, barChart]);

  // function addData(data) {
  //   if(barChart.current.data.labels.indexOf(data) === -1){
  //     console.log(data)
  //     barChart.current.data.labels.push(data);
  //     barChart.current.update();
  //   }
  // }

//   function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
//   }


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