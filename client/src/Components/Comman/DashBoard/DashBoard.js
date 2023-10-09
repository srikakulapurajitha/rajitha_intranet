import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
//import NavBar from '../sidenav/navbar';
import Box from '@mui/material/Box';
import {  Backdrop, Container, Grid, List, ListItem, ListItemAvatar,  ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import OfficeCalender from './OfficeCalendar';
import BirthDayList from './BirthDayList';
//import { CardActionArea } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';

//import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
// import Groups2Icon from '@mui/icons-material/Groups2';
// import PersonSearchIcon from '@mui/icons-material/PersonSearch';
// import ContactMailIcon from '@mui/icons-material/ContactMail';
//import { ReactSVG } from "react-svg";
import './DashBoard.css'

// import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Marquee from "react-fast-marquee";

// import Button from '@mui/material/Button';

// const Item = styled(Box)(({ theme }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//     height:80
//   }));


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


import PersonIcon from '@mui/icons-material/Person';

import Chart from 'react-apexcharts'

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';


const convertDateFormat = (date) =>{
    let day = date.getDate()
    if (day < 10){
     day='0'+day
    }
    let month = date.getMonth()+1
    if (month < 10){
     month='0'+month
    }
    return date.getFullYear()+'-'+month+'-'+day
  }

var d = new Date();
var getTot = daysInMonth(d.getMonth(),d.getFullYear()); //Get total days in a month
console.log('tot',getTot)
var sat = [];   //Declaring array for inserting Saturdays
var sun = [];   //Declaring array for inserting Sundays

for(var i=1;i<=getTot;i++){    //looping through days in month
    var newDate = new Date(d.getFullYear(),d.getMonth(),i)
    //console.log(newDate)
    if(newDate.getDay()===0){   //if Sunday
        sun.push(convertDateFormat(newDate))
    }
    if(newDate.getDay()===6){   //if Saturday
        sat.push(convertDateFormat(newDate));
    }

}
console.log('sat:',sat);
console.log('sun:',sun);


function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

const lastTenDays = new Date ((new Date ()).getTime () - (11 * 86400000))
console.log('10:',lastTenDays)
const tenDays=[]

for(let i=1;i<=10;i++){
    tenDays.push(convertDateFormat(new Date(lastTenDays.getTime()+(i*86400000))))

}
console.log('TenDays:',tenDays)


const Dashboard = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //const yesterday = new Date().getDate()-1
    

    const [open, setOpen] = useState(false);
    const handleClose = () => {
      setOpen(false);
    };
    const handleOpen = () => {
      setOpen(true);
    };

    
    const xLabels = [
        '12-08-23',
        '13-08-23',
        '14-08-23',
        '15-08-23',
        '16-08-23',
        '17-08-23',
        '18-08-23',
        '19-08-23',
        '20-08-23',
        '21-08-23',
        
   ]
    const workingHours = [0, 0, 9.15, 9.00, 9.00, 9.00, 9.00, 0, 0, 9.00, ]

    //let hrBal = workingHours.reduce((accumulator, currentValue) => accumulator + currentValue, 0)-(90-(9*workingHours.filter(n=> n===0).length))
    //hrBal = parseFloat(hrBal.toFixed(2))
    let bal_min = workingHours.reduce((accumulator, currentValue) => accumulator + parseFloat((currentValue%1).toFixed(2)*100)+ (Math.trunc(currentValue)*60), 0)-(90*60-(9*workingHours.filter(n=> n===0).length)*60)
    const bal_hr = parseFloat(Math.trunc(bal_min/60)+(bal_min%60)/100).toFixed(2)

    console.log('m:',bal_hr)
    

    
    const [visible, setVisible] = useState({ 'uan': false, 'policy': false, 'acc': false })
    const handleVisibility = (acctype) => {
        //console.log(visible[acctype])
        switch (acctype) {
            case 'uan':
                setVisible({ ...visible, 'uan': !visible['uan'] })
                break
            case 'policy':
                setVisible({ ...visible, 'policy': !visible['policy'] })
                break
            case 'acc':
                setVisible({ ...visible, 'acc': !visible['acc'] })
                break
            default:
                setVisible({ ...visible })
        }

        //setVisible({...visible,acctype:!visible[acctype]})
        console.log(visible)


    }

    const myAccounts = () => {

        return (
            <Container sx={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center' }}>

                <Paper elevation={1}>
                    <List>
                        <ListItem >
                            <ListItemText primary="UAN:" />
                            {
                                visible['uan'] ?
                                    <>
                                        <ListItemText secondary="1234567890" />
                                        <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('uan')}>
                                            <ListItemAvatar>
                                                <VisibilityIcon sx={{ color: 'gray' }} />

                                            </ListItemAvatar>
                                        </IconButton>

                                    </> :
                                    <>
                                        <ListItemText secondary="xxxxxxxxxxxxx" />
                                        <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('uan')}>
                                            <ListItemAvatar>
                                                <VisibilityOffIcon sx={{ color: 'gray' }} />

                                            </ListItemAvatar>
                                        </IconButton>

                                    </>
                            }

                        </ListItem>
                        <Divider light />
                        <ListItem >
                            <ListItemText primary="Policy No:" />
                            {
                                visible['policy'] ?
                                    <>
                                        <ListItemText secondary="4101230200000205-00" />
                                        <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('policy')}>
                                            <ListItemAvatar>
                                                <VisibilityIcon sx={{ color: 'gray' }} />

                                            </ListItemAvatar>
                                        </IconButton>

                                    </> :
                                    <>

                                        <ListItemText secondary="xxxxxxxxxxxxx" />
                                        <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('policy')}>
                                            <ListItemAvatar>
                                                <VisibilityOffIcon sx={{ color: 'gray' }} />

                                            </ListItemAvatar>
                                        </IconButton>

                                    </>
                            }
                        </ListItem>
                        <Divider light />
                        <ListItem >
                            <ListItemText primary="Salary Account No:" />
                            {
                                visible['acc'] ?
                                    <>
                                        <ListItemText secondary="793601500083" />
                                        <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('acc')}>
                                            <ListItemAvatar>
                                                <VisibilityIcon sx={{ color: 'gray' }} />

                                            </ListItemAvatar>
                                        </IconButton>

                                    </> :
                                    <>

                                        <ListItemText secondary="xxxxxxxxxxxxx" />
                                        <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('acc')}>
                                            <ListItemAvatar>
                                                <VisibilityOffIcon sx={{ color: 'gray' }} />
                                            </ListItemAvatar>
                                        </IconButton>

                                    </>
                            }
                        </ListItem>




                    </List>
                </Paper>
            </Container>

        )

    }

    const myPays = () => {

        
        return (
            <div>
                 <Button onClick={handleOpen}>Show backdrop</Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
                    <img src='loader1.gif' alt='loader' style={{ mixBlendMode: 'lighten' }} />
                </Backdrop>
                
            </div>
        );

        // function createData(name, calories, fat) {
        //     return { name, calories, fat };
        // }
        // const rows = [
        //     createData('July', 20917, 1800),
        //     createData('June', 20917, 1800),
        //     createData('May', 20917, 1800),
        // ];
        // return (
        //     <Box >
        //         <Typography component='h4' variant='p' sx={{p:1,ml:1}}>
        //             Last 3 Months Transaction
        //         </Typography>
        //         <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center" }} >
        //         <TableContainer component={Paper} >
        //             <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
        //                 <TableHead>
        //                     <TableRow>
        //                         <TableCell align="center">Month</TableCell>
        //                         <TableCell align="center">Salary</TableCell>
        //                         <TableCell align="center">PF</TableCell>
        //                     </TableRow>
        //                 </TableHead>
        //                 <TableBody>
        //                     {rows.map((row) => (
        //                         <TableRow
        //                             key={row.name}
        //                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        //                         >
        //                             <TableCell align="center" component="th" scope="row">
        //                                 {row.name}
        //                             </TableCell>
        //                             <TableCell align="center">{row.calories}</TableCell>
        //                             <TableCell align="center">{row.fat}</TableCell>


        //                         </TableRow>
        //                     ))}
        //                 </TableBody>
        //             </Table>
        //         </TableContainer>
                
        //         </Container>
        //         <Container sx={{display:'bloack',p:2}}>
        //         <a href="/"  rel="noopener noreferrer"  >
        //             Pay slips
        //         </a>
        //         </Container>
        //     </Box>
        // )

    }


    const attendanceTrend = () => {
        const data = {
            series: [
                {
                    name: "worked Hours",
                    data: workingHours,

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
                    categories: xLabels,
                    

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
                    Hour Balence: {bal_hr>=0?<span style={{display:'flex',alignItems:'center',color:'green'}}>{bal_hr} hr</span>:<span style={{display:'flex',alignItems:'center',color:'rgba(255, 0, 0, 0.8)'}}>{bal_hr} hr</span>}
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




    const cartV = (
        <Card sx={{ height: 390, p: 1 }}>
            <Typography variant="p" component="div" sx={{ display: 'flex', justifyContent: 'center', fontSize: 20, alignItems: 'center' }}>
                Personal Section <PersonIcon />
            </Typography>
            <Divider light />

            <Box sx={{ display: 'flex', flexDirection: 'column', height: 305 }}>


                <Tabs value={value} onChange={handleChange} variant='fullWidth' centered  >
                    <Tab label="My Attendace" />
                    <Tab label="My Pays" />
                    <Tab label="My Accounts" />
                </Tabs>
                <Box sx={{ height: 290, width: '100%', display: 'flex', flexDirection: 'column' }}>
                    {
                        value === 0 ? attendanceTrend() : value === 1 ? myPays() : value === 2 ? myAccounts() : null
                    }
                </Box>

            </Box>
            <Divider>
                Important Links
            </Divider>
            <Container sx={{ height: 45, display: 'flex', flexDirection: 'row', justifyContent: "space-around", }}>
                <a href="https://unifiedportal-mem.epfindia.gov.in/memberinterface/" target="_blank" rel="noopener noreferrer" style={{ height: '100%' }}>
                    <img alt="EPFO" src='EPFO.png' style={{ height: '90%', objectFit: 'contain' }} />
                </a>

                <a href="https://www.healthindiatpa.com/" target="_blank" rel="noopener noreferrer" style={{ height: '100%' }}>
                    <img alt="Health India" src='insurance.png' style={{ height: '90%', objectFit: 'contain' }} />
                </a>
                <a href="https://www.icicibank.com/" target="_blank" rel="noopener noreferrer" style={{ height: '100%' }}>
                    <img alt="icici bank" src='icici.png' style={{ height: '90%', objectFit: 'contain' }} />
                </a>
            </Container>


        </Card>)
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                
                <NavBar />
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 6 }}>

                    <Grid container spacing={{ xs: 2, md: 2 }} style={{ display: 'flex' }}>
                        <Grid item xs={12} sm={12} md={12} >
                            <Box sx={{ color: 'red' }}>Notice*</Box>
                            <Card>
                                <Marquee>
                                    <span style={{ margin: 10 }}>1: Please be in Boardroom sharp at 4:30PM.</span>
                                    <span style={{ color: '#F8373D', margin: 10 }}>2: Everyone must keep the wastege in Dustbin only.</span>
                                </Marquee>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={8} >
                            <Card sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', height: 80, p: 1 }} >
                                <CardMedia
                                    component="img"
                                    sx={{ display: 'flex', maxWidth: 80, maxHeight: 80, borderRadius: '50%', justifyContent: 'center', alignItems: 'center' }}
                                    image="profile.jpg"
                                    alt="profile"
                                />
                                <CardContent  >
                                    <Typography component="div" variant="h5">
                                        Akash Gajanan Dandge (1260)
                                    </Typography>
                                    <Typography component="div" variant="p" color='gray'>
                                        Role: Software Developer
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexDirection: { xs: 'row', md: 'row' }, height: 80, p: 1, fontWeight: 'bold' }} >
                                <Stack direction="row" spacing={3} >
                                    <Box>
                                        <IconButton sx={{
                                            '&:hover, &:focus': {
                                                bgcolor: 'unset',
                                            }
                                        }}
                                            size="small"
                                            onClick={() => console.log('clicked')}
                                        >
                                            <img className="static" alt='img' src="bcgteams.png" style={{ width: 50, height: 50 }} /><img className="active" alt='imgs' style={{ width: 50, height: 50 }} src="bcgteams.gif" />
                                        </IconButton>

                                        <Typography variant="p" component="div" sx={{ textAlign: 'center', fontSize: 12 }}>
                                            Teams
                                        </Typography>
                                    </Box>

                                    <Divider orientation="vertical" variant="middle" flexItem />

                                    <Box>
                                        <IconButton sx={{
                                            '&:hover, &:focus': {
                                                bgcolor: 'unset',
                                            }
                                        }} size="small">
                                            <img className="static" alt='img' src="directory.png" style={{ width: 50, height: 50 }} /><img className="active" alt='imgs' style={{ width: 50, height: 50 }} src="directory.gif" />
                                        </IconButton>
                                        <Typography variant="p" component="div" sx={{ textAlign: 'center', fontSize: 12 }}>
                                            Directory Search
                                        </Typography>
                                    </Box>

                                    <Divider orientation="vertical" variant="middle" flexItem />
                                    <Box>
                                        <IconButton sx={{
                                            '&:hover, &:focus': {
                                                bgcolor: 'unset',
                                            }
                                        }} size="small">
                                            <img className="static" alt='img' src="cross.png" style={{ width: 50, height: 50 }} /><img className="active" alt='imgs' style={{ width: 50, height: 50 }} src="cross.gif" />
                                        </IconButton>
                                        <Typography variant="p" component="div" sx={{ textAlign: 'center', fontSize: 12 }}>
                                            Cross Roads
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            {cartV}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <BirthDayList />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <OfficeCalender />
                        </Grid>
                    </Grid>

                </Box>
            </Box>
        </>

    );
}

export default Dashboard;
