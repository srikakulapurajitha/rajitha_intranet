import {  Typography } from '@mui/material'
import React from 'react'
import Chart from 'react-apexcharts'
// import UserContext from '../../context/UserContext'
// import axios from 'axios'

function AttendanceGraph(props) {
    const {graphData} = props
    
    // const workingHours = [0, 0, 9.15, 9.00, 9.00, 9.00, 9.00, 0, 0, 9.00, ]
    // console.log(graphData)
    console.log('m:',graphData)

    const data = {
        series: [
            {
                name: "worked Hours",
                data: graphData.totalhrs,

            },
        ],

        options: {
            chart: {
                height: 350,
                type: "line",
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "straight",
            },

            title: {
                text: "Last 10Days Attendance Trend",
                align: "left",
                style: {
                    fontSize: "12px",
                    color: '#E66161'
                  }
                
            },
            fill:{
                type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [ '#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      },

            },

            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
                },
            },

            xaxis: {
                categories: graphData.date,
                

            },
            yaxis: {
                title: {
                    text: 'Hours Present'
                }
            },
        },
    };

    return (

        <div>
            {/* <LineChart
            xAxis={[{ scaleType: 'point',data: xLabels,label:'Months (2023)'}]}
            yAxis={[{ label:'No. of Leaves'}]}
            series={[
                {
                data: [0,0,1,3,0,0,0,8,0,0,0,0], label:'Aproved Leaves'
                },
            ]}
            width={400}
            height={250}  
            /> */}
             
            <Typography variant='p' component={'h5'} display={'flex'} justifyContent={'flex-end'} sx={{color:'gray',p:1}} >
                Hour Balence: <span style={{display:'flex',alignItems:'center',color:graphData.bal_hr>=0?'green':'red'}}>{graphData.bal_hr} hr</span>
            </Typography>
            <Chart
                options={data.options}
                series={data.series}
                type="line"
                height={230}
            />
            
        </div>
    );
}

export default AttendanceGraph