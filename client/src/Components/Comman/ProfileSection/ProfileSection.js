import { Box, Card, Grid, Paper, Tab, Tabs } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import AdminNavBar from '../NavBar/AdminNavBar'
import UserNavBar from '../NavBar/UserNavBar'
import UserContext from '../../context/UserContext'
import PersonalInfo from './PersonalInfo'
import ContactInfo from './ContactInfo'
import FamilyInfo from './FamilyInfo'
import FunInfo from './FunInfo'
import TimeZone from './TimezoneInfo'
import axios from 'axios'
import Loader from '../Loader'


function ProfileSection() {
    const [section, setSection] = useState(0)
    const [timezone, setTimezone] = useState('');
    const [funInfo, setFunInfo] = useState({
        favorite_movie: '',
        favorite_place: '',
        favorite_sport: '',
        favorite_food: '',
        favorite_actor: '',
        favorite_actress: '',
        quote: '',
        good_quality: '',
        bad_quality: ''

    });
    const [familyData, setFamilyData] = useState({
        spouse_name: '',
        no_of_kids: 0,
        kids_names: '',
        anniversary_date: null,
        blood_group: ''
    });
    const [contactInfo, setContactInfo] = useState({
        address: '',
        zip_code: '',
        home_phone: '',
        home_phone_ext: '',
        office_phone: '',
        office_phone_ext: '',
        mobile1: '',
        mobile2: '',
        mobile3: '',
        mobile4: '',
        mobile5: '',
        msn: '',
        aol: '',
        skype: '',
        yahoo: '',
        gtalk: ''

    })
    const [loader, setLoader] = useState(true)
    const { userDetails, handleUserDetails } = useContext(UserContext)


    useEffect(() => {
        const fetchData = async () => {
            if (userDetails) {

                try {
                    const timzoneData = await axios.post('/api/gettimezoneinformation', { emp_id: userDetails.employee_id })
                    //console.log(timzoneData.data[0].timezone)
                    if (timzoneData.data.length !== 0) {
                        setTimezone(timzoneData.data[0].timezone)
                        setLoader(false)

                    }
                    else {
                        setLoader(false)
                    }
                    //setTimezone(timzoneData)

                    const funData = await axios.post('/api/getfuninformation', { emp_id: userDetails.employee_id })
                    if (funData.data.length !== 0) {
                        setFunInfo(funData.data[0])
                    }

                    const familyInfo = await axios.post('/api/getfamilyinformation', { emp_id: userDetails.employee_id })
                    if (familyInfo.data.length !== 0) {

                        setFamilyData({ ...familyInfo.data[0], anniversary_date: familyInfo.data[0].anniversary_date ? new Date(familyInfo.data[0].anniversary_date).toLocaleString('en-CA').slice(0, 10) : null })

                    }

                    const contactData = await axios.post('/api/getcontactinformation', { emp_id: userDetails.employee_id })
                    if (contactData.data.length !== 0) {
                        setContactInfo(contactData.data[0])

                    }

                    setLoader(false)


                }
                catch {
                    setLoader(false)
                }

            }
        }
        fetchData()




    }, [userDetails])



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
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: { xs: '100%', lg: '43ch' }, width: '80%', p: 1 }}>
                                    {section === 0 ? <PersonalInfo userDetails={userDetails} handleUserDetails={handleUserDetails} /> : section === 1 ? <ContactInfo contactInfo={contactInfo} setContactInfo={setContactInfo} /> : section === 2 ? <FamilyInfo familyData={familyData} setFamilyData={setFamilyData} /> : section === 3 ? <FunInfo funInfo={funInfo} setFunInfo={setFunInfo} /> : section === 4 ? <TimeZone timezoneInfo={timezone} setTimeZoneInfo={setTimezone} /> : <></>}
                                </Paper>
                            </Box>

                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Loader loader={loader} />
        </>

    )
}

export default ProfileSection