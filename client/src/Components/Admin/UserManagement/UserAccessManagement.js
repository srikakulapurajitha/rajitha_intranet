import {FormLabel, Autocomplete, Box, Button, Checkbox, Collapse, Container, FormControl, FormControlLabel, FormGroup, Grid, Paper, Stack, TextField, Typography, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RestartAlt, Update } from '@mui/icons-material'
import Loader from '../../Comman/Loader'
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'
import CryptoJS from 'crypto-js'

function UserAccessManagement() {
    const [loader, setLoader] = useState(true)
    const [inputValue, setInputValue] = useState('')
    const [users, setUsers] = useState([])
    const [userData, setUserData] = useState({ user: null, status: '', department: '', user_type: '' })
    const [acceessData, setAccessData] = useState({})

    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const userData = await axios.get('/api/getemployeedata')
                //console.log(userData)
                setUsers(userData.data)

                setLoader(false)
            }
            catch(err) {
                //console.log(err)

                toast.error('not able to fetch data!')
            }
        }
        fetchUserData()
    }, [])

    const acceessType = {
        user: {
            'Common Access': {
                PersonalSection: true,
                BirthdayList: true,
                OfficeCalender: true,
                Payslips:true,
                Attendance: true,
                ApplyLeave: true,
                BalanceLeaves: true,
                HistoryLog: true,
                ReportingStructure: true

            },
        },
        admin: {
            'Common Access': {
                PersonalSection: true,
                BirthdayList: true,
                OfficeCalender: true,
                Payslips:true,
                Attendance: true,
                ApplyLeave: true,
                BalanceLeaves: true,
                HistoryLog: true,
                ReportingStructure: true

            },
            'Admin Access': {
                AddCompany: true,
                ViewCompany: true,
                AddCompanyPages: true,
                ViewCompanyPages: true,
                AddUser: true,
                ViewUsers: true,
                EmployeeDetailsManagement:true,
                UserAccessManagement: true,
                Experience: true,
                AddAnnouncement: true,
                ViewAnnouncements: true,
                UploadGallery: true,
                ViewGallery: true,
                UploadAttendance: true,
                ViewAttendance: true,
                GenerateAttendance:true,
                CreateReportingStructure: true,
                ViewReportingStructure: true,
                HistorylogAdmin: true,
                ManageBalanceLeaves: true

            },
            'Accounts Access':{
                SalaryManagement:true
            }
        },
        accounts :{
            'Common Access': {
                PersonalSection: true,
                BirthdayList: true,
                OfficeCalender: true,
                Payslips:true,
                Attendance: true,
                ApplyLeave: true,
                BalanceLeaves: true,
                HistoryLog: true,
                ReportingStructure: true

            },
            'Accounts Access':{
                SalaryManagement:true
            }
            
            

        },
        it:{
            'Common Access': {
                PersonalSection: true,
                BirthdayList: true,
                OfficeCalender: true,
                Payslips:true,
                Attendance: true,
                ApplyLeave: true,
                BalanceLeaves: true,
                HistoryLog: true,
                ReportingStructure: true

            },
            'IT Access':{
                UploadAttendance: true,
                ViewAttendance: true,
            }

        },
        hr:{
            'Common Access': {
                PersonalSection: true,
                BirthdayList: true,
                OfficeCalender: true,
                Payslips:true,
                Attendance: true,
                ApplyLeave: true,
                BalanceLeaves: true,
                HistoryLog: true,
                ReportingStructure: true

            },
            'HR Access':{
                
                AddCompanyPages: true,
                ViewCompanyPages: true,
                AddUser: true,
                ViewUsers: true,
                EmployeeDetailsManagement:true,
                Experience: true,
                AddAnnouncement: true,
                ViewAnnouncements: true,
                UploadGallery: true,
                ViewGallery: true,
                UploadAttendance: true,
                ViewAttendance: true,
                GenerateAttendance:true,
                CreateReportingStructure: true,
                ViewReportingStructure: true,
                HistorylogAdmin: true,
                ManageBalanceLeaves: true
            }

        }

    }

    const handleUserSelection = (_, newValue) => {
        //console.log(newValue)
        if (newValue !== null) {
            const { value } = newValue
            setLoader(true)
            setUserData({ ...userData, user: newValue, emp_id: value.employee_id, status: value.status, department: value.department, user_type: value.user_type })
            axios.post('/api/getaccessdata', { emp_id: value.employee_id })
                .then(res => {
                    //console.log(res.data)
                    setLoader(false)
                    const decrypted = JSON.parse(CryptoJS.AES.decrypt(res.data,process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
                    if (decrypted.length === 0) {
                        if (value.user_type === 'admin' && value.department === 'management') {
                            //console.log(acceessType.admin)
                            setAccessData(acceessType['admin'])
                        }
                        else if(value.user_type === 'admin' && value.department === 'accounts'){
                            setAccessData(acceessType['accounts'])
                        }
                        else if(value.user_type === 'admin' && value.department === 'it'){
                            setAccessData(acceessType['it'])
                        }
                        else if(value.user_type === 'admin' && value.department === 'hr'){
                            setAccessData(acceessType['hr'])
                        }
                        
                        else {
                            setAccessData(acceessType['user'])
                        }
                    }
                    else {
                        const data = decrypted[0]
                        const access_pages = data['restricted_pages'].split(',')
                        let selectedAccessType;

                        if (value.user_type === 'admin' && value.department === 'management') {
                            selectedAccessType = acceessType['admin']
                        }
                        else if(value.user_type === 'admin' && value.department === 'accounts'){
                            selectedAccessType = acceessType['accounts']
                        }
                        else if(value.user_type === 'admin' && value.department === 'it'){
                            selectedAccessType = acceessType['it']
                        }
                        else if(value.user_type === 'admin' && value.department === 'hr'){
                            selectedAccessType = acceessType['hr']
                        }
                        else {
                            selectedAccessType = acceessType['user']
                        }
                        Object.keys(selectedAccessType).forEach(acc => {
                            Object.keys(selectedAccessType[acc]).forEach(page => {
                                //console.log(page)
                                if (access_pages.includes(page)) {
                                    selectedAccessType[acc][page] = false
                                }
                                else {
                                    selectedAccessType[acc][page] = true
                                }

                            })
                        })
                        setAccessData(selectedAccessType)
                    }

                })
                .catch((err) => {
                    //console.log(err)
                    setLoader(false)
                    toast.error(err.response.data)
                })
        }
        else {
            setAccessData({})
            setUserData({ user: null, status: '', department: '', user_type: '' })
        }

    }


    const handleResetAccess = () => {
        if (userData.user_type === 'admin' && userData.department === 'management') {
            //console.log(acceessType.admin)
            setAccessData(acceessType['admin'])
        }
        else if(userData.user_type === 'admin' && userData.department === 'accounts'){
            setAccessData(acceessType['accounts'])
        }
        else if(userData.user_type === 'admin' && userData.department === 'it'){
            setAccessData(acceessType['it'])
        }
        else if(userData.user_type === 'admin' && userData.department === 'hr'){
            setAccessData(acceessType['hr'])
        }
        else {
            setAccessData(acceessType['user'])
        }

    }

    const handleUpdateAccess = () => {
        //console.log(acceessData)
        const pagesToBeAccessed = Object.keys(acceessData).map(accType => Object.keys(acceessData[accType]).filter(page => !acceessData[accType][page])).flat(1)
        //console.log(pagesToBeAccessed)
        toast.promise(axios.post('/api/updateuseraccess', { emp_id: userData.emp_id, pagesToBeAccessed: pagesToBeAccessed }), {
            pending: {
                render() {
                    return 'Updating Access'
                }
            },
            success: {
                render(res) {
                    setAccessData({})
                    setUserData({ user: null, status: '', department: '', user_type: '' })
                    return res.data.data
                }
            },
            error: {
                render(err) {
                    return err.data.response.data
                }
            }
        })
    }
    return (
        <>
        
            <Box sx={{ minHeight: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
               <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: 'auto',
                            width: '100%',

                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={0.5} textAlign={'center'} >User Access Management</Typography>
                        <Grid container display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} sm={12} lg={10}>
                                <Paper elevation={10} sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', p: 1 }}>
                                    <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', p: 1 }}>
                                        <Box style={{ width: '100%' }}>
                                            <Stack spacing={2}>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        size='small'
                                                        inputValue={inputValue}
                                                        disablePortal
                                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                                        options={users}
                                                        getOptionLabel={(option) => option.label || ""}
                                                        onChange={handleUserSelection}
                                                        onInputChange={(_, newInputValue) => {
                                                            setInputValue(newInputValue)
                                                        }}


                                                        value={userData.user}
                                                        renderInput={(params) => <TextField fullWidth size='small' {...params} required label="Select Employee" />}
                                                    />

                                                </FormControl>
                                                <Stack direction={{ lg: 'row', xs: 'column' }} display={'flex'} justifyContent={'center'} spacing={2}>
                                                    <TextField
                                                        type='text'
                                                        label='Status'
                                                        size='small'
                                                        value={userData.status}
                                                        disabled
                                                    />
                                                    <TextField
                                                        type='text'
                                                        label='User Type'
                                                        size='small'
                                                        value={userData.user_type}
                                                        disabled

                                                    />
                                                    <TextField
                                                        type='text'
                                                        label='Department'
                                                        size='small'
                                                        value={userData.department}
                                                        disabled

                                                    />
                                                </Stack>
                                                <Collapse in={Object.keys(acceessData).length !== 0} unmountOnExit timeout={'auto'}   >
                                                    <Box>
                                                        <Typography component={'h5'} variant='p' textAlign={'center'}>Select Fields to Access</Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', border: '2px solid gray', height: 'auto', flexDirection: 'column' }}>
                                                            <Container sx={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: { lg: 'row', xs: 'column', sm: 'column', md: 'row' } }}>
                                                                {
                                                                    Object.keys(acceessData).map((acc, index) => (
                                                                        <FormControl key={index} sx={{ m: 1 }} component="fieldset" variant="standard">
                                                                            <FormLabel component="legend" style={{ fontWeight: 'bold' }}>{acc}</FormLabel>
                                                                            <FormGroup >
                                                                                {
                                                                                    Object.keys(acceessData[acc]).map(page => (


                                                                                        <FormControlLabel
                                                                                            key={page}

                                                                                            control={
                                                                                                <Checkbox size='small' name={page} checked={acceessData[acc][page]} onChange={e => setAccessData({ ...acceessData, [acc]: { ...acceessData[acc], [page]: e.target.checked } })} />
                                                                                            }
                                                                                            label={page}

                                                                                        />
                                                                                    )
                                                                                    )

                                                                                }
                                                                            </FormGroup>
                                                                        </FormControl>

                                                                    ))
                                                                }

                                                            </Container>
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', m: 1 }}>
                                                                <Stack direction={'row'} spacing={3}>
                                                                    <Button size='small' color='info' variant='contained' onClick={handleResetAccess} endIcon={<RestartAlt />}> Reset Access</Button>
                                                                    <Button size='small' color='success' variant='contained' onClick={handleUpdateAccess} endIcon={<Update />}>Update Access</Button>
                                                                </Stack>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Collapse>
                                                {Object.keys(acceessData).length === 0 ?
                                                    <Box sx={{ maxHeight: '300px', width: '100%', display: 'flex', justifyContent: 'center', }}>
                                                        <img style={{ objectFit: 'contain', width: '100%', height: 'auto' }} src='access.png' alt='Access' />
                                                    </Box>
                                                    : null
                                                }
                                            </Stack>
                                        </Box>
                                    </Container>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
            <Loader loader={loader} />
        </>
    )
}

export default UserAccessManagement