import { Avatar, Box, Card, Container,  FormControl, Grid,  List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'

import Select from 'react-select'
import axios from 'axios'
import { South } from '@mui/icons-material'
import { toast } from 'react-toastify'
import PropagateLoader from "react-spinners/PropagateLoader";
import AccessNavBar from '../NavBar/AccessNavBar'



function ReportingStructure() {

    const [selectedOption, setSelectedOption] = useState({})
    const [selectedUser, setSelectedUser] = useState('')
    const [searchLoading, setSearchLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [reportingHeadData, setReportingHeadData] = useState([])
    const [reportingUserData, setReportingUserData] = useState([])
    const [loadingData, setLoadingData] = useState(false)


    const options = [
        { value: 'Reporting Head', label: 'Reporting Head' },
        { value: 'Employee', label: 'Employee' },
    ]
    const handleSearchBy = (e) => {
        //console.log(e.value)
        const selected_option = e.value
        setSearchLoading(true)
        setSelectedOption(e)
        setSelectedUser([])
        setReportingHeadData([])

        axios.post('/api/reportingusers', { option: selected_option })
            .then(result => {
                setUsers(result.data)
                setSearchLoading(false)
            })
            .catch((err) => {
                setUsers([{ value: '', label: '' }])
                setSearchLoading(false)
                toast.error(err.response.data)
            })
    }
    const handleUserSelection = (e) => {
        //console.log(e, selectedOption)
        setSelectedUser(e)
        setLoadingData(true)
        axios.post('/api/getreportingstructuredata', { option: selectedOption.value, emp_id: e.value.employee_id })
            .then(result => {
                // setUsers(result.data)
                // setSearchLoading(false)
                setLoadingData(false)
                if (selectedOption.value === 'Employee') {
                    setReportingUserData([e.value])
                    setReportingHeadData(result.data)
                }
                else {
                    setReportingHeadData([e.value])
                    setReportingUserData(result.data)
                }
                
            })
            .catch(() => {
                setLoadingData(false)
                toast.error('unable fetch data')

            })


    }
    return (
        <>
            <Box sx={{ height: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
                <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: '100%',
                            width: '100%',

                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >View Reporting Structure</Typography>
                        <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} sm={12} lg={10}>
                                <Paper elevation={10}>
                                    <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', height: 'auto' }}>
                                        <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>

                                            <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }}>


                                                <FormControl fullWidth>
                                                    <Typography variant='p' m={0.5} component={'h5'} >Search By:</Typography>
                                                    <Select id='search' options={options} isSearchable={false} onChange={handleSearchBy} />

                                                </FormControl>
                                                <FormControl fullWidth >
                                                    <Typography variant='p' m={0.5} component={'h5'} >Select {selectedOption.label}   </Typography>
                                                    <Select
                                                        value={selectedUser}
                                                        options={users}
                                                        isLoading={searchLoading}
                                                        onChange={handleUserSelection}

                                                    />

                                                </FormControl>

                                            </Stack>


                                        </Container>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', direction: 'column', alignItems: 'center', mt: 1, height: '400px' }}>
                                            <PropagateLoader
                                                color={'#c0c0c0'}
                                                loading={loadingData&&(reportingHeadData.length === 0 || reportingUserData === 0) }
                                                speedMultiplier={0.8}
                                                size={25}
                                                aria-label="Loading PropagateLoader"
                                                data-testid="loader"
                                            />
                                            {
                                                reportingHeadData.length !== 0 && reportingUserData !== 0 ?
                                                    <Container sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', width: '100%', height: '400px', }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                                                            <FormControl>
                                                                <Typography marginBottom={0.5} component={'h4'} variant='p' textAlign={'center'}>Reporting Head</Typography>
                                                                <Card sx={{ width: '100%' }}>
                                                                    <List>
                                                                        {reportingHeadData.map(({ profile_pic, fullname, employee_id, designation }, index) => {
                                                                            return (
                                                                                <Box key={index}>

                                                                                    <ListItem alignItems="flex-start"

                                                                                    >
                                                                                        <ListItemAvatar>
                                                                                            <Avatar alt={fullname} src={profile_pic} />
                                                                                        </ListItemAvatar>
                                                                                        <ListItemText
                                                                                            primary={`${fullname} (bcg/${employee_id})`}
                                                                                            secondary={designation}
                                                                                        />

                                                                                    </ListItem>

                                                                                </Box>

                                                                            )
                                                                        })}
                                                                    </List>



                                                                </Card>



                                                            </FormControl>


                                                        </Box>
                                                        <South fontSize='large' />
                                                        <Typography marginBottom={0.5} component={'h4'} variant='p'>Reporting Users</Typography>
                                                        <Box width={{ xs: '100%', lg: '80%' }}>


                                                            <Card sx={{ overflow: 'auto', maxHeight: 200 }} >
                                                                <List dense>
                                                                    {reportingUserData.map(({ profile_pic, fullname, employee_id, designation }, index) => {
                                                                        return (
                                                                            <Box key={index}>

                                                                                <ListItem alignItems="flex-start"

                                                                                >
                                                                                    <ListItemAvatar>
                                                                                        <Avatar alt={fullname} src={profile_pic} />
                                                                                    </ListItemAvatar>
                                                                                    <ListItemText
                                                                                        primary={`${fullname} (bcg/${employee_id})`}
                                                                                        secondary={designation}
                                                                                    />

                                                                                </ListItem>

                                                                            </Box>

                                                                        )
                                                                    })}
                                                                </List>
                                                            </Card>

                                                        </Box>


                                                    </Container>

                                                    : null
                                            }
                                        </Box>




                                    </Container>



                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
        </>
    )
}

export default ReportingStructure