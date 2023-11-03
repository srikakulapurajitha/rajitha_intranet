import React, { useContext, useEffect, useState} from 'react';
import AdminNavBar from '../NavBar/AdminNavBar';
//import NavBar from '../sidenav/navbar';
import Box from '@mui/material/Box';
import {  Container, Grid,  } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import OfficeCalender from './OfficeCalendar';
import BirthDayList from './BirthDayList';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
//import { ReactSVG } from "react-svg";
import './DashBoard.css'

import IconButton from '@mui/material/IconButton';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PersonIcon from '@mui/icons-material/Person';
 
import UserContext from '../../context/UserContext';
import UserNavBar from '../NavBar/UserNavBar';
import AttendanceGraph from './AttendanceGraph';
import MyPays from './MyPays';
import MyAccounts from './MyAccounts';
import Notice from './Notice';
import axios from 'axios';

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
    const {userDetails} = useContext(UserContext)
    const [graphData, setGraphData] = useState({date:[],totalhrs:[],bal_hr:0})
    const [birthdayData, setBirthdayData] = useState([])
    const [calenderData, setCalenderData] = useState([])

    useEffect(()=>{
        axios.post('/api/attendancegraphdata',{emp_id:userDetails.employee_id})
        .then(res=>{
            console.log(res.data)
            let options = [{ day: 'numeric' }, { month: 'short' }];
                function join(date, options, separator) {
                    function format(option) {
                        let formatter = new Intl.DateTimeFormat('en', option);
                        return formatter.format(date);
                    }
                    return options.map(format).join(separator);
                }
                const date = res.data.graphData.map(d => (join(new Date(d.pdate), options, '-')))
                const dateData = date.reverse().slice(0,10).reverse()
                const totalhrs = res.data.graphData.map(d => d.totalhrs)
                const totalhrsData = totalhrs.reverse().slice(0,10).reverse()
                const bal_hr = res.data.balance
                setGraphData({date:dateData,totalhrs:totalhrsData,bal_hr:bal_hr})
        })
        axios.get('/api/birthdaylist')
        .then(res => setBirthdayData(res.data))
        .catch()
        axios.get('/api/holidaylist')
        .then(res => {
              ////console.log('data', res.data)
            setCalenderData(res.data) // main data
      
        })
        .catch(err => {
              ////console.log(err)
        })
    },[userDetails])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //const yesterday = new Date().getDate()-1
    

    // const [open, setOpen] = useState(false);
    // const handleClose = () => {
    //   setOpen(false);
    // };
    // const handleOpen = () => {
    //   setOpen(true);
    // };



    // const myPays = () => {

        
    //     return (
    //         <div>
    //              <Button onClick={handleOpen}>Show backdrop</Button>
    //   <Backdrop
    //     sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    //     open={open}
    //     onClick={handleClose}
    //   >
    //                 <img src='loader.gif' alt='loader' style={{ mixBlendMode: 'lighten' }} />
    //             </Backdrop>
                
    //         </div>
    //     );

        

    // }


    



    const personalSetion = (
        <Card sx={{ height: 390, p: 1 }}>
            <Typography variant="p" component="div" sx={{ display: 'flex', justifyContent: 'center', fontSize: 20, alignItems: 'center' }}>
                Personal Section <PersonIcon sx={{m:0.5, color:'gray'}} fontSize='8' />
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
                        value === 0 ? <AttendanceGraph graphData={graphData}/> : value === 1 ? <MyPays/> : value === 2 ? <MyAccounts /> : null
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
                
                {userDetails.access==='admin'?<AdminNavBar />:<UserNavBar/>}
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 6 }}>

                    <Grid container spacing={{ xs: 2, md: 2 }} style={{ display: 'flex' }}>
                        <Grid item xs={12} sm={12} md={12} >
                            <Notice />
                        </Grid>
                        <Grid item xs={12} sm={6} md={8} >
                            <Card sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', height: 80, p: 1 }} >
                                <CardMedia
                                    component="img"
                                    sx={{ display: 'flex', maxWidth: 80, maxHeight: 80, borderRadius: '50%', justifyContent: 'center', alignItems: 'center' }}
                                    image={userDetails.profile_pic!==''?userDetails.profile_pic:userDetails.gender==='male'?'maleavatar.png':'femaleavatar.png'}
                                    alt="profile"
                                />
                                <CardContent  >
                                    <Typography component="div" variant="h5">
                                        {`${userDetails.first_name} ${userDetails.last_name} (bcg/${userDetails.employee_id})`}
                                    </Typography>
                                    <Typography component="div" variant="p" color='gray'>
                                        {userDetails.designation}
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
                            {personalSetion}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <BirthDayList birthdayData={birthdayData} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <OfficeCalender data={calenderData}/>
                        </Grid>
                    </Grid>

                </Box>
            </Box>
        </>

    );
}

export default Dashboard;
