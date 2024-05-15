import React, { useContext, useEffect, useState } from 'react';
//import NavBar from '../sidenav/navbar';
import Box from '@mui/material/Box';
import { Container, Grid, } from '@mui/material';
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

import AttendanceGraph from './AttendanceGraph';
import MyPays from './MyPays';
import MyAccounts from './MyAccounts';
import Notice from './Notice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { toast } from 'react-toastify';

import { Steps } from 'intro.js-react';
import "intro.js/introjs.css";
import { UserAccessContext } from '../../context/UserAccessContext';
import AccessNavBar from '../NavBar/AccessNavBar';
import CryptoJS from 'crypto-js';



const Dashboard = () => {
    const [value, setValue] = React.useState(0);
    const { userDetails } = useContext(UserContext)
    const [graphData, setGraphData] = useState({ date: [], totalhrs: [], bal_hr: 0 })
    const [birthdayData, setBirthdayData] = useState([])
    const [calenderData, setCalenderData] = useState([])
    const [notice, setNotice] = useState([])
    const [salaryData, setSalaryData] = useState([])
    const [loader, setLoader] = useState(true)

    const [stepsEnabled, setStepsEnabled] = useState(false);
    const [startTour, setStartTour] = useState(false);
    const { pagesToBeNotAccessed } = useContext(UserAccessContext)
    const [employeeInfo, setEmployeeInfo] = useState({ uan: '', pan_number: '', account_number: '' })

    const steps = [
        {
            element: '.notice',
            intro: 'All announcements will be displayed here',
            restrict: notice.length === 0 ? 'no announcement' : null
        },
        {
            element: ".profile-section",
            intro: "In this section your profile image with your name, emp id and designation will display",
            position: 'right',
            restrict: null
        },
        {
            element: ".teams",
            intro: "In teams section as per company names their corresponding company pages will display ",
            restrict: null
        },
        {
            element: '.directory-search',
            intro: 'In directory search section you can search employees based on various filters',
            restrict: null
        },
        {
            element: '.cross-road',
            intro: 'In this section you can see Birthday calender and Timezone',
            restrict: null
        },
        {
            element: '.personal-section',
            intro: 'In this section you can view my attendance,my pays and my accounts',
            position: 'right',
            restrict: 'PersonalSection'
        },
        {
            element: '.my-attendance',
            intro: 'In this section your 10 days attendance will be displayed in graph also you can check your balance hours as well',
            restrict: 'PersonalSection'
        },

        {
            element: '.my-pays',
            intro: 'In this section your last 3 months transaction will display ',
            restrict: 'PersonalSection'
        },
        {
            element: '.my-accounts',
            intro: 'In this section your account numbers like UAN, Health Policy, Salary Account number will display',
            restrict: 'PersonalSection'
        },

        {
            element: '.birthday-list',
            intro: 'Here current month employees birthday will display',
            position: 'left',
            restrict: 'BirthdayList'
        },
        {
            element: '.view-link-birthdays',
            intro: 'Here all/filtered employees birthday list will display ',
            restrict: 'BirthdayList'

        },
        {
            element: '.office-calender',
            intro: 'Here you will find a calender having holidays',
            restrict: 'OfficeCalender'
        },

        {
            element: '.view-link-calender',
            intro: 'from here you can explore the various company pages like holidays list',
            restrict: 'OfficeCalender'
        },

        {
            element: '.account-menu',
            intro: 'In this section you can view profile, change password and logout',
            restrict: null
        },
        {
            element: '.navigation-menu',
            intro: 'This is the navigation menu',
            restrict: null
        },
        {

            title: '<img style="max-width:200px;height:50px" src="https://res.cloudinary.com/dozj3jkhe/image/upload/v1701168256/intranet/gdyr4cwcrsn9z1ercoku.png" alt="img" />',
            intro: '<h2 >Welcome To Brightcom Group</h2>',
            restrict: null

        }



    ]


    const navigate = useNavigate()
    const { width, height } = useWindowSize()



    useEffect(() => {
        const fetchData = async () => {
            try {
                const ann = await axios.post('/api/notice', { company_name: userDetails.company_name, department: userDetails.department, date: new Date().toLocaleDateString('en-CA').slice(0, 10) })
                //console.log('ann', ann)
                setNotice(ann.data)
                const res = await axios.post('/api/attendancegraphdata', { emp_id: userDetails.employee_id })
                let options = [{ day: 'numeric' }, { month: 'short' }];
                function join(date, options, separator) {
                    function format(option) {
                        let formatter = new Intl.DateTimeFormat('en', option);
                        return formatter.format(date);
                    }
                    return options.map(format).join(separator);
                }
                const date = res.data.graphData.map(d => (join(new Date(d.pdate), options, '-')))
                const dateData = date.reverse().slice(0, 10).reverse()
                const totalhrs = res.data.graphData.map(d => d.totalhrs)
                const totalhrsData = totalhrs.reverse().slice(0, 10).reverse()
                const bal_hr = res.data.balance
                setGraphData({ date: dateData, totalhrs: totalhrsData, bal_hr: bal_hr })
                const salary = await axios.post('/api/lastsalarythreerecoreds', { emp_id: userDetails.employee_id })
                setSalaryData(salary.data)
                const holidays = await axios.post('/api/holidaylist', { department: userDetails.department })
                setCalenderData(holidays.data)
                const birthdays = await axios.get('/api/birthdaylist')
                setBirthdayData(birthdays.data)
                const intro = await axios.post('/api/checkuserintrodetails', { employee_id: userDetails.employee_id })
                setStepsEnabled(intro.data)
                const employeeDetailsResult = await axios.get('/api/employeedetails', { params: { emp_id: userDetails.employee_id } })
                const decrypted_data = JSON.parse(CryptoJS.AES.decrypt(employeeDetailsResult.data, process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
                if (decrypted_data.length !== 0) {
                    setEmployeeInfo(decrypted_data[0])
                }
                //console.log('intro', intro)




                setLoader(false)


            }
            catch (err) {
                //console.log(err.response.status)
                setLoader(false)

                if (err.message === "Network Error") {
                    toast.error('please check your internet and try again!')
                }
                else if (err.response.status === 504) {
                    toast.error('not able get data contact admin!')
                }


            }

        }
        if (userDetails.employee_id !== undefined) {
            fetchData()

        }
        else {
            setLoader(false)
        }


    }, [userDetails])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const userIntroTour = () => {
        //console.log('its clicked')
        setStepsEnabled(true)
        setStartTour(true);
    };

    const onExit = async (stepIndex) => {
        //console.log('onexit', stepIndex,startTour)
        setStepsEnabled(false);
        if (!startTour && stepIndex !== -1) {
            await axios.post('/api/adduserintro', { employee_id: userDetails.employee_id })
        }

    }


    const personalSetion = (
        <Card className='personal-section' sx={{ height: 390, p: 1 }}>
            <Typography variant="p" component="div" sx={{ display: 'flex', justifyContent: 'center', fontSize: 20, alignItems: 'center' }}>
                Personal Section <PersonIcon sx={{ m: 0.5, color: 'gray' }} fontSize='8' />
            </Typography>
            <Divider light />

            <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: 295 }}>
                <Tabs value={value} onChange={handleChange} variant='fullWidth' centered  >
                    <Tab className='my-attendance' label="My Attendance" />
                    <Tab className='my-pays' label="My Pays" />
                    <Tab className='my-accounts' label="My Accounts" />
                </Tabs>
                <Box sx={{ height: 290, width: '100%', display: 'flex', flexDirection: 'column' }}>
                    {
                        value === 0 ? <AttendanceGraph graphData={graphData} /> : value === 1 ? <MyPays salaryData={salaryData} /> : value === 2 ? <MyAccounts employeeInfo={employeeInfo}/> : null
                    }
                </Box>
            </Box>
            <Divider>
                Important Links
            </Divider>
            <Container sx={{ height: 50, display: 'flex', flexDirection: 'row', justifyContent: "space-around", }}>
                <a href="https://unifiedportal-mem.epfindia.gov.in/memberinterface/" target="_blank" rel="noopener noreferrer" style={{ height: '100%' }}>
                    <img alt="EPFO" src='EPFO.png' style={{ height: '70%', objectFit: 'contain' }} />
                </a>

                <a href="https://www.healthindiatpa.com/" target="_blank" rel="noopener noreferrer" style={{ height: '100%' }}>
                    <img alt="Health India" src='insurance.png' style={{ height: '70%', objectFit: 'contain' }} />
                </a>
                <a href="https://www.icicibank.com/" target="_blank" rel="noopener noreferrer" style={{ height: '100%' }}>
                    <img alt="icici bank" src='icici.png' style={{ height: '70%', objectFit: 'contain' }} />
                </a>
            </Container>


        </Card>)




    return (
        <>
            <Box sx={{ display: 'flex', }}>
                <AccessNavBar userIntroTour={userIntroTour} />
                <Box component='main' sx={{ flexGrow: 1, p: 2.5, mt: 6, }}>

                    <Grid container spacing={{ xs: 2, md: 2 }} style={{ display: 'flex', }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} >
                            <Notice notice={notice} />

                        </Grid>
                        <Grid item xs={12} sm={6} md={8} >

                            <Card className='profile-section' sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', height: 80, p: 2 }} >

                                <CardMedia
                                    component="img"
                                    sx={{ display: 'flex', maxWidth: 70, maxHeight: 70, borderRadius: '50%', justifyContent: 'center', alignItems: 'center' }}
                                    image={userDetails.profile_pic !== '' ? userDetails.profile_pic : userDetails.gender === 'male' ? 'maleavatar.png' : 'femaleavatar.png'}
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
                                    <Box className='teams'>
                                        <IconButton sx={{
                                            '&:hover, &:focus': {
                                                bgcolor: 'unset',
                                            }
                                        }}
                                            size="small"
                                            onClick={() => navigate("/teams", { relative: true })}
                                        >
                                            <img className="static" alt='img' src="bcgteams.png" style={{ width: 50, height: 50 }} /><img className="active" alt='imgs' style={{ width: 50, height: 50 }} src="bcgteams.gif" />
                                        </IconButton>

                                        <Typography variant="p" component="div" sx={{ textAlign: 'center', fontSize: 12 }}>
                                            Teams
                                        </Typography>
                                    </Box>

                                    <Divider orientation="vertical" variant="middle" flexItem />

                                    <Box className='directory-search'>
                                        <IconButton sx={{
                                            '&:hover, &:focus': {
                                                bgcolor: 'unset',
                                            }
                                        }}
                                            size="small"
                                            onClick={() => navigate("/directorysearch", { relative: true })}
                                        >
                                            <img className="static" alt='img' src="directory.png" style={{ width: 50, height: 50 }} /><img className="active" alt='imgs' style={{ width: 50, height: 50 }} src="directory.gif" />
                                        </IconButton>
                                        <Typography variant="p" component="div" sx={{ textAlign: 'center', fontSize: 12 }}>
                                            Directory Search
                                        </Typography>
                                    </Box>

                                    <Divider orientation="vertical" variant="middle" flexItem />
                                    <Box className='cross-road'>
                                        <IconButton sx={{
                                            '&:hover, &:focus': {
                                                bgcolor: 'unset',
                                            }
                                        }} size="small"
                                            onClick={() => navigate("/crossroads", { relative: true })}
                                        >
                                            <img className="static" alt='img' src="cross.png" style={{ width: 50, height: 50 }} /><img className="active" alt='imgs' style={{ width: 50, height: 50 }} src="cross.gif" />
                                        </IconButton>
                                        <Typography variant="p" component="div" sx={{ textAlign: 'center', fontSize: 12 }}>
                                            Office Zone
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>

                        {pagesToBeNotAccessed === null ? null : !pagesToBeNotAccessed.includes('PersonalSection') ?
                            <Grid item xs={12} sm={6} md={4}>
                                {personalSetion}
                            </Grid>

                            : null
                        }

                        {pagesToBeNotAccessed === null ? null : !pagesToBeNotAccessed.includes('BirthdayList') ?
                            <Grid item xs={12} sm={6} md={4}>
                                <BirthDayList birthdayData={birthdayData} />
                            </Grid>

                            : null
                        }

                        {pagesToBeNotAccessed === null ? null : !pagesToBeNotAccessed.includes('OfficeCalender') ?
                            <Grid item xs={12} sm={6} md={4}>
                                <OfficeCalender data={calenderData} />
                            </Grid>

                            : null
                        }
                    </Grid>

                </Box>
            </Box>
            <Loader loader={loader} />
            <Confetti
                width={width}
                height={height}
                run={new Date(userDetails.date_of_birth).getMonth() === new Date().getMonth() && new Date(userDetails.date_of_birth).getDate() === new Date().getDate()}
            />
            <Steps
                enabled={stepsEnabled}
                steps={steps.filter(st => (!pagesToBeNotAccessed.includes(st.restrict) && st.restrict !== 'no announcement'))}
                initialStep={0}
                onExit={onExit}
                options={{ doneLabel: 'Done', exitOnOverlayClick: false, exitOnEsc: false }}
            />

        </>

    );
}

export default Dashboard;
