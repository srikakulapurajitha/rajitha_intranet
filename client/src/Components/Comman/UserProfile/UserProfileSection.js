import { Avatar, Box, Card, Container,  Grid, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import UserContext from '../../context/UserContext'
import AdminNavBar from '../NavBar/AdminNavBar'
import UserNavBar from '../NavBar/UserNavBar'
import axios from 'axios'

import './UserProfileSection.css'
import Loader from '../Loader'

import UserPersonalInfo from './UserPersonalInfo'
import UserContactInfo from './UserContactInfo'
import UserFunInfo from './UserFunInfo'
import UserFamilyInfo from './UserFamilyInfo'
import SendBirthDayWishes from './SendBirthDayWishes'


function UserProfileSection() {
    const { emp_id } = useParams()
    const [section, setSection] = useState(0)
    const [personalInfo, setPersonalInfo] = useState({
        profile_pic: '',
        fullname: '',
        designation: '',
        employee_id: '',
        blood_group: '',
        email: '',
        company_name: '',
        gender: '',
        date_of_birth: null,
        country: '',
        about_yourself: ""

    })
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
    const { userDetails } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSectionChange = (event, newValue) => {
        //console.log(event,newValue)
        setSection(newValue)

    }

    useEffect(() => {
        const fetchData = async () => {


            try {

                const personalData = await axios.post('/api/getuserdetails', { emp_id: emp_id })
                if (personalData.data.length !== 0) {
                    setPersonalInfo({ ...personalData.data[0], date_of_birth: personalData.data[0].date_of_birth ? new Date(personalData.data[0].date_of_birth).toLocaleString('en-CA').slice(0, 10) : null })

                }


                const funData = await axios.post('/api/getfuninformation', { emp_id: emp_id })
                if (funData.data.length !== 0) {
                    setFunInfo(funData.data[0])
                }

                const familyInfo = await axios.post('/api/getfamilyinformation', { emp_id: emp_id })
                if (familyInfo.data.length !== 0) {

                    setFamilyData({ ...familyInfo.data[0], anniversary_date: familyInfo.data[0].anniversary_date ? new Date(familyInfo.data[0].anniversary_date).toLocaleString('en-CA').slice(0, 10) : null })

                }

                const contactData = await axios.post('/api/getcontactinformation', { emp_id: emp_id })
                if (contactData.data.length !== 0) {
                    setContactInfo(contactData.data[0])

                }

                setLoader(false)


            }
            catch {
                setLoader(false)
            }


        }
        fetchData()




    }, [emp_id])
    console.log(userDetails.employee_id,emp_id)

    if ( userDetails.employee_id===Number(emp_id)){
        //return navigate('/myprofile')
       return <Navigate to='/myprofile' replace={true} />
    }
    return (
        <>
            <Box sx={{ height: '100vh', width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
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
                            <Grid item sm={12} lg={12}>
                                <Card>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                        <Tabs value={section} onChange={handleSectionChange} variant='fullWidth' centered  >
                                            <Tab label="Peronal Info" />
                                            <Tab label="Contact Info" />
                                            <Tab label="Family Info" />
                                            <Tab label="Fun Info" />
                                            <Tab label="Send Birthday Wishes" />
                                        </Tabs>

                                    </Box>
                                </Card>

                            </Grid>
                            <Grid item xs={12} sm={12} lg={3} md={4}>
                                <Paper sx={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: "350px", "&:hover": { boxShadow: 10 }, }}>
                                    <Box sx={{ p: 1 }}>
                                        <Avatar
                                            alt='profile'
                                            src={personalInfo.profile_pic}
                                            sx={{ width: 120, height: 120 }}
                                        />




                                    </Box>
                                    <Typography m={0.5} component={'h3'} variant='p'>{personalInfo.fullname}</Typography>
                                    <Typography component={'h6'} color='gray' variant='p'>{personalInfo.designation}</Typography>




                                    <Container sx={{ display: 'flex', justifyContent: 'center', }} >

                                        <table className='profile-table'>
                                            <tbody>
                                                <tr>
                                                    <td className='table-heading-mobile'>Emp ID</td>
                                                    <td>:</td>
                                                    <td>{personalInfo.employee_id}</td>
                                                </tr>
                                                <tr>
                                                    <td className='table-heading-mobile'>Blood Group</td>
                                                    <td>:</td>
                                                    <td>{personalInfo.blood_group}</td>
                                                </tr>
                                            </tbody>
                                        </table>


                                    </Container>




                                </Paper>

                            </Grid>
                            <Grid item xs={12} sm={9} lg={9}>
                                {
                                    section === 0 ? <UserPersonalInfo personalInfo={personalInfo} /> : section === 1 ? < UserContactInfo contactInfo={contactInfo} /> : section === 2 ? <UserFamilyInfo familyInfo={familyData} /> : section === 3 ? <UserFunInfo funInfo={funInfo} /> : section === 4 ? <SendBirthDayWishes sendData={{ name: `${userDetails.first_name} ${userDetails.last_name}`, from: userDetails.email, to: personalInfo.email }} /> : null
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
            <Loader loader={loader} />

        </>
    )
}

export default UserProfileSection