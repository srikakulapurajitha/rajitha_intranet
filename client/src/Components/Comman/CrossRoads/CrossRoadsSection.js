import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import { Box, Grid, Paper, Tab, Tabs, } from '@mui/material'
import AdminNavBar from '../NavBar/AdminNavBar'
import UserNavBar from '../NavBar/UserNavBar'
import TimeZone from './TimeZone'
import BirthDayCalender from './BirthDayCalender'


function CrossRoadsSection() {
    const { userDetails } = useContext(UserContext)
    const [section, setSection] = useState(0)

    return (
        <>
            <Box sx={{ height: 'auto', width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
                {userDetails.access === 'admin' ? <AdminNavBar /> : <UserNavBar />}
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 2 }, backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: '100%',
                            width: '100%',

                        }}
                    >
                        <Grid
                            container
                            spacing={2}

                        >
                            <Grid item xs={0} sm={9} lg={7}>

                            </Grid>
                            <Grid item xs={12} sm={3} lg={5}>
                                <Paper>
                                    <Tabs value={section} onChange={(e, new_value) => setSection(new_value)} variant='fullWidth' centered  >
                                        <Tab label="Birthday Calender 🎂" />
                                        <Tab label="Time Zones 🕒" />

                                    </Tabs>
                                </Paper>

                            </Grid>
                            <Grid item xs={12} lg={12}>
                                {section === 0 ? <BirthDayCalender /> : section === 1 ? <TimeZone /> : null}

                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
        </>
    )
}

export default CrossRoadsSection