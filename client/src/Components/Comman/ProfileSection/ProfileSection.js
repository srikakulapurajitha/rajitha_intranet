import { Box, Card, Grid,  Paper,  Tab, Tabs} from '@mui/material'
import React, { useContext, useState } from 'react'
import AdminNavBar from '../NavBar/AdminNavBar'
import UserNavBar from '../NavBar/UserNavBar'
import UserContext from '../../context/UserContext'
import PersonalInfo from './PersonalInfo'
import ContactInfo from './ContactInfo'


function ProfileSection() {
    const [section, setSection] = useState(0)
    const { userDetails,handleUserDetails } = useContext(UserContext)

    const handleSectionChange = (event, newValue) => {
        //console.log(event,newValue)
        setSection(newValue)

    }

    

    return (
        <>
            <Box sx={{ display: 'flex' }}>

                {userDetails.access === 'admin' ? <AdminNavBar /> : <UserNavBar />}
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>

                    <Grid container spacing={{ xs: 2, md: 2 }} style={{ display: 'flex' }}>
                        <Grid item xs={12} sm={12} md={12} >
                            <Card>
                            <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                <Tabs value={section} onChange={handleSectionChange} variant='fullWidth' centered  >
                                    <Tab label="Peronal Info" />
                                    <Tab label="Contact Info" />
                                    <Tab label="Family Info" />
                                    <Tab label="Fun Info" />
                                    <Tab label="Time Zone Info" />
                                </Tabs>

                            </Box>
                            </Card>
                            <Box sx={{mt:4, display: 'flex', justifyContent:'center'  }}>
                            <Paper elevation={5}  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',height:{xs:'100%',lg:'43ch'},width:'80%',p:1 }}>
                               {section===0?<PersonalInfo userDetails={userDetails} handleUserDetails={handleUserDetails} />:section===1?<ContactInfo />:<></>} 
                            </Paper>
                            </Box>
                            
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>

    )
}

export default ProfileSection