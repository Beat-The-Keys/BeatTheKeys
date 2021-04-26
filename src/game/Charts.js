import React, {useEffect, useRef, useState} from 'react'
import { Bar } from "react-chartjs-2";
import styled from 'styled-components';
import { socket } from "../LoginScreen";


const Charts = React.memo(({room}) => {
  const barChart = useRef(null)
  // const [barDate, setBarDate] = useState({})

    var config = {
      type:'bar',
    data: {
      labels: ["January"],
      datasets: [{
        label: "My First dataset",
        data: [10],
        fill: false
      }]
    },
  };
  // const fun = ()=>{
  //   setBarDate([barDate+5])
  // }
    useEffect(() => {
      // socket.on('updatePlayerStats', (data)=>{
      //   console.log(data)
      //   setBarDate(data)

      //   // setActivePlayerStats(data.playerStats);
      // })
      const interval = setInterval(() => {
        // console.log(activePlayerStats)
          barChart.current.data.datasets[0].data[0] = barChart.current.data.datasets[0].data[0]+5;
        barChart.current.update();
      }, 1000);


        return () => {
          clearInterval(interval)
        }
    }, [])

    return (
      <div>
      {console.log("here")}
      <BarChart ref={barChart} data={config.data}/>
      </div>
    )
});

export default Charts;

const BarChart = styled(Bar)`
  @media (min-width:960px){
    display: block;
    box-sizing: border-box;
    height: 198px;
    width: 397.7px;
  }
`;