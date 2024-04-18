import React, { useState } from 'react'

import { Box, Grid, Paper, Tab, Tabs, } from '@mui/material'

import TimeZone from './TimeZone'
import BirthDayCalender from './BirthDayCalender'
import OfficeGallery from './OfficeGallery'
import AccessNavBar from '../NavBar/AccessNavBar'


function CrossRoadsSection() {
    
    const [section, setSection] = useState(0)

    return (
        <>
            <Box sx={{ minHeight: '100vh', width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
                <AccessNavBar />
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
                            
                            <Grid item xs={12} sm={3} lg={12} sx={{ position: 'sticky', top: '50px', zIndex: 9 }}>
                                <Paper >
                                    <Tabs   value={section} onChange={(e, new_value) => setSection(new_value)} variant='fullWidth' centered  >
                                        <Tab label="Birthday Calender 🎂" />
                                        <Tab label="Office Gallery 🖼️" />
                                        <Tab label="Time Zones 🕒" />

                                    </Tabs>
                                </Paper>

                            </Grid>
                            <Grid item xs={12} lg={12}>
                                <Box >
                                    {section === 0 ? <BirthDayCalender /> : section === 1 ?<OfficeGallery />:section===2? <TimeZone /> : null}

                                </Box>
                               

                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
        </>
    )
}

export default CrossRoadsSection