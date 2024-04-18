import React, {  useState } from 'react'

import { Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography, Zoom } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DataTable from 'react-data-table-component'
import dayjs from 'dayjs'

import { toast } from 'react-toastify'
import axios from 'axios'
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'



//import {Tooltip} from '@mui/material';

const PatchTooltip = ({ children, ...props }) =>
    <Tooltip {...props}>
        <span>{children}</span>
    </Tooltip>





function HistoryLogAdmin() {
    

    const [historyLogSearch, setHistoryLogSearch] = useState({
        applicationType: '',
        fromDate: null,
        toDate: null,
        emp_id:''
    })
    const [dateError, setDateError] = useState(false)
    const [historyLogData, setHistoryLogData] = useState([])
    const [showRecord, setShowRecord] = useState(false)
    const [applicationId, setApplicationId] = useState('')




    const columns = [
        {
            name: 'Employee Id',
            selector: (row) => row.emp_id,
            center: true,
            

        },
        {
            name: 'From Date',
            selector: (row, index) => {
                //row.selected_dates.split(',').join('\n')
                let dateRanges = (row.from_date === '' && row.to_date === '' ? `${row.half_day}` : `${row.selected_dates}, ${row.half_day}`)
                const fromDate = row.from_date === '' && row.to_date === '' ? row.half_day : row.from_date
                return (
                    <PatchTooltip title={dateRanges} arrow >
                        {fromDate}

                    </PatchTooltip>
                )

            },

            center: true,
            

        },
        {
            name: 'No of days',
            selector: (row) => row.total_leaves,
            center: true,
           
        },
        {
            name: 'Reason',
            selector: (row) => {
                return (
                    <PatchTooltip title={`${row.reason}`} followCursor disableInteractive TransitionComponent={Zoom}
                        slotProps={{
                            popper: {
                                modifiers: [
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [10, 0,],

                                        },
                                    },
                                ],
                            },
                        }}
                    >
                        {row.reason}
                    </PatchTooltip>
                )
            },
            center: true,
            maxWidth: '300px'

        },
        {
            name: 'Status',
            selector: (row) => <Typography component={'h4'} variant='p' sx={{ color: (row.status === 'approved' ? 'green' : row.status === 'pending' ? 'orange' : 'red') }}>{row.status}</Typography>,
            center: true,
            
        },
        
    ];

    const updateSearch = () =>{
        if (historyLogSearch.fromDate === null || historyLogSearch === null) {
            setDateError(true)
        }
        else {
            setDateError(false)
            axios.post('/api/historylogapplication',historyLogSearch)
                .then((result) => {
                    //console.log(result.data)
                    setShowRecord(true)
                    setHistoryLogData(result.data)
                })
                .catch(() => toast.error('unable to fetch logs'))
        }

    }

    const handleHistoryLogSearch = (e) => {
        e.preventDefault()
        //console.log(historyLogSearch)
        updateSearch()

        
    }
    const serachApplication = (e)=>{
        e.preventDefault()
        axios.post('/api/searchapplication',{applicationId:applicationId})
                .then((result) => {
                    //console.log(result.data)
                    setShowRecord(true)
                    setHistoryLogData(result.data)
                })
                .catch((err) => toast.error(err.response.data))
        }
    
    


    return (
        <>
            <Box sx={{ height: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
                <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: 'auto',
                            width: '100%',

                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >History Log for all applications</Typography>
                        <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} sm={12} lg={10}>
                                <Paper elevation={10}>
                                    <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems:'center', flexDirection: 'column', mt:2 }}>
                                        <Stack onSubmit={serachApplication} component={'form'} direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} width={'100%'} >
                                            <FormControl fullWidth  variant="outlined">
                                            <TextField
                                            type='text'
                                            label='Application Id'
                                            size='small'
                                            required
                                            value={applicationId}
                                            onChange={e => setApplicationId(e.target.value)}
                                            />

                                                </FormControl>
                                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", height: '100%' }} >
                                                        <Button type='submit' size='small' color='success' variant='contained'>submit</Button>
                                                    </Box>
                                                </Stack>
                                            


                                        </Container>
                                        <Typography component={'h4'} variant='p' sx={{textAlign:'center',textDecoration:'underline', m:1}}>OR</Typography>


                                        <Container component={'form'} onSubmit={handleHistoryLogSearch} sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center', height: '100%', width: '100%', }}>
                                            <Stack spacing={2} width={'100%'}  >
                                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} >
                                            <FormControl fullWidth  variant="outlined">
                                            <TextField
                                            type='number'
                                            label='Employee Id'
                                            size='small'
                                            required
                                            inputProps={{min:1}}
                                            value={historyLogSearch.emp_id}
                                            onChange={e => setHistoryLogSearch({ ...historyLogSearch, emp_id: e.target.value })}
                                            />

                                                </FormControl>
                                            <FormControl fullWidth variant="outlined">
                                                    <InputLabel required size='small'>Application Type</InputLabel>
                                                    <Select size='small' value={historyLogSearch.applicationType} onChange={e => setHistoryLogSearch({ ...historyLogSearch, applicationType: e.target.value })} label='Application Type' required>
                                                        <MenuItem value='Leave'>Leave</MenuItem>
                                                        {/* <MenuItem value='Permission'>Permission</MenuItem>
                                                        <MenuItem value='Work From Home'>Work From Home</MenuItem>
                                                        <MenuItem value='Working on Week Ends/Holidays'>Working on Week Ends/Holidays</MenuItem>
                                                        <MenuItem value='Shift Change'>Shift Change</MenuItem>
                                                        <MenuItem value='Mispunch'>Mispunch</MenuItem> */}


                                                    </Select>
                                                </FormControl>
                                                </Stack>
                                                
                                                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} >



                                                    <FormControl fullWidth variant="outlined">
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <MobileDatePicker

                                                                value={historyLogSearch.fromDate ? dayjs(historyLogSearch.fromDate) : null}
                                                                onChange={e => {
                                                                    //console.log(e)
                                                                    if (e !== null) {
                                                                        setHistoryLogSearch({ ...historyLogSearch, fromDate: e.$d.toLocaleDateString('en-CA') })
                                                                    }

                                                                }}
                                                                slotProps={{ textField: { size: 'small', required: true, error: dateError } }}
                                                                label="From Date"
                                                                format='DD/MM/YYYY'
                                                                maxDate={historyLogSearch.toDate ? dayjs(historyLogSearch.toDate) : null}
                                                            //startIcon={<Event />} // Calendar icon
                                                            />
                                                        </LocalizationProvider>


                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <MobileDatePicker

                                                                value={historyLogSearch.toDate ? dayjs(historyLogSearch.toDate) : null}
                                                                onChange={e => {
                                                                    if (e !== null) {
                                                                        setHistoryLogSearch({ ...historyLogSearch, toDate: e.$d.toLocaleDateString('en-CA') })
                                                                    }
                                                                }}
                                                                slotProps={{ textField: { size: 'small', required: true, error: dateError } }}
                                                                label="To Date"
                                                                format='DD/MM/YYYY'
                                                                minDate={historyLogSearch.fromDate ? dayjs(historyLogSearch.fromDate) : null}
                                                            />
                                                        </LocalizationProvider>


                                                    </FormControl>
                                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", height: '100%' }} >
                                                        <Button type='submit' size='small' color='success' variant='contained'>submit</Button>
                                                    </Box>
                                                </Stack>

                                            </Stack>

                                        </Container>
                                        <Box sx={{ height: '260px', width: '100%', p: 2, display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
                                            {
                                                showRecord ?
                                                    <Card>
                                                        <DataTable
                                                            responsive
                                                            fixedHeader={true}
                                                            fixedHeaderScrollHeight='160px'
                                                            columns={columns}
                                                            data={historyLogData}
                                                            dense
                                                        />
                                                    </Card>
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

export default HistoryLogAdmin