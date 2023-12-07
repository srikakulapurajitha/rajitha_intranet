import React, { useEffect } from 'react'
import { Container, Card, CardContent, Typography, Grid, Divider, ListItemText, ListItem, List, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';

function BirthDayCalender() {

    const [companyNames, setCompanyName] = useState([])
    const [birthdayData, setBirthdayData] = useState([])
    const [filterBirthDays, setFilterBirthDays] = useState(birthdayData)
    const [selectedCompany, setSelectedCompany] = useState('All')
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const birthdays = await axios.get('/api/birthdaylist')
                setBirthdayData(birthdays.data)
                console.log(birthdays.data)
                const compNames = Array.from(new Set(birthdays.data.map(data => data.company_name)))
                console.log('names', compNames)
                setCompanyName(compNames)
                const monthCal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => ({ [m]: birthdays.data.filter(data => new Date(data.date_of_birth).getMonth() === m) }))
                setFilterBirthDays(monthCal)
                setLoader(false)

            }
            catch {
                setLoader(false)
            }

        }

        fetchData()

    }, [])

    //const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

    const handleCompanyChange = (e) => {
        const val = e.target.value
        setSelectedCompany(val)
        if (val !== 'All') {
            const filterData = birthdayData.filter(data => data.company_name === val)
            console.log(filterData)
            const monthCal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => ({ [m]: filterData.filter(data => new Date(data.date_of_birth).getMonth() === m) }))
            console.log(monthCal)
            setFilterBirthDays(monthCal)


        }
        else {
            const monthCal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => ({ [m]: birthdayData.filter(data => new Date(data.date_of_birth).getMonth() === m) }))
            setFilterBirthDays(monthCal)
            console.log(monthCal[0][1])
        }
    }


    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }

    return (
        <>
            <Container >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', maxWidth: "25ch" }}>
                    <FormControl fullWidth>
                        <InputLabel size='small'>Company Name</InputLabel>
                        <Select fullWidth label='Company Name' value={selectedCompany} onChange={handleCompanyChange} size='small'>
                            <MenuItem value='All'>All</MenuItem>
                            {
                                companyNames.map(names => <MenuItem key={names} value={names}>{names}</MenuItem>)
                            }

                        </Select>
                    </FormControl>

                </Box>

                <Typography variant="p" component="div" sx={{ display: 'flex', justifyContent: 'center', fontSize: 20, alignItems: 'center', m: 1 }}>
                    Birthday Calender
                    <CalendarMonthIcon fontSize='medium' />

                </Typography>
                <Grid container spacing={3}>
                    {filterBirthDays.map((month, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', "&:hover": { boxShadow: 10 } }}>
                                <CardContent >
                                    <Typography variant="h6" component="div" sx={{ fontSize: 18, fontWeight: 'bold', color: 'blueviolet', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                        {months[index]}
                                    </Typography>
                                    <Divider sx={{ borderColor: 'black' }} />
                                    <List sx={{ height: '300px', width: '100%', overflow: 'auto', }}>
                                        {
                                            month[index].length === 0 ? <ListItem alignItems='flex-start' sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <ListItemText primary='No birthdays in this month' />
                                            </ListItem> :
                                                month[index].map((item, i) => (
                                                    <Box key={i}>
                                                        <ListItem alignItems='flex-start' sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <ListItemText
                                                                secondary={
                                                                    <>
                                                                        <Link to={`/viewuserprofile/${item.employee_id}/info`} style={{ textDecoration: 'none', color: 'none' }}>
                                                                            <span style={{ fontWeight: 'bold', color: 'black' }}>{`${new Date(item.date_of_birth).toLocaleDateString(undefined, { day: 'numeric', month: 'short', })} `}</span> - <span style={{ color: 'gray' }}>{item.first_name + ' ' + item.last_name} </span><span style={{ fontSize: '8px', color: 'gray' }}> {`[${item.company_name}, ${item.country}]`}</span>
                                                                        </Link>
                                                                    </>
                                                                }
                                                            />
                                                        </ListItem>
                                                        <Divider />
                                                    </Box>
                                                ))

                                        }

                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>
            <Loader loader={loader} />
        </>
    )
}


export default BirthDayCalender