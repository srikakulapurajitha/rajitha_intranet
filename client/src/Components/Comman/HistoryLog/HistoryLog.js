import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import { Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Tooltip, Typography, Zoom } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DataTable from 'react-data-table-component'
import dayjs from 'dayjs'
import { Cancel } from '@mui/icons-material'
import { toast } from 'react-toastify'
import axios from 'axios'
import AccessNavBar from '../NavBar/AccessNavBar'


const PatchTooltip = ({ children, ...props }) =>
    <Tooltip {...props}>
        <span>{children}</span>
    </Tooltip>

function HistoryLog() {
    const { userDetails } = useContext(UserContext)

    const [historyLogSearch, setHistoryLogSearch] = useState({
        applicationType: '',
        fromDate: null,
        toDate: null
    })
    const [dateError, setDateError] = useState(false)
    const [historyLogData, setHistoryLogData] = useState([])
    const [showRecord, setShowRecord] = useState(false)


    const columns = [
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
            maxWidth: '150px'

        },
        {
            name: 'No of days',
            selector: (row) => row.total_leaves,
            center: true,
            maxWidth: '30px'
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
            maxWidth: '80px'
        },
        {
            name: 'Action',
            cell: (row) => {
                let isDisable = false;
                if (row.status === 'denied' || row.status === 'cancelled') {
                    isDisable = true
                }
                if (row.total_leaves === 0.5 && row.status !== 'denied' && row.status !== 'cancelled') {
                    const day = new Date(row.half_day)
                    const today = new Date()
                    if (day.getDate() > 26) {
                        const expiry = new Date(day.getFullYear(), day.getMonth() + 1, 25)
                        if (today < expiry) {
                            isDisable = false
                        }
                        else {
                            isDisable = true
                        }

                    }
                    else {
                        const expiry = new Date(day.getFullYear(), day.getMonth(), 25)
                        if (today < expiry) {
                            isDisable = false
                        }
                        else {
                            isDisable = true
                        }

                    }
                }
                else if (row.total_leaves > 0.5 && row.status !== 'denied' && row.status !== 'cancelled') {
                    //console.log(row.total_leaves, row.from_date)
                    const day = new Date(row.from_date)
                    const today = new Date()
                    if (day.getDate() > 26) {
                        const expiry = new Date(day.getFullYear(), day.getMonth() + 1, 25)
                        //console.log('check cl', today < expiry)
                        if (today < expiry) {
                            isDisable = false
                        }
                        else {
                            isDisable = true
                        }

                    }
                    else {
                        const expiry = new Date(day.getFullYear(), day.getMonth(), 25)
                        //console.log('check1 cl', today < expiry)
                        if (today < expiry) {
                            isDisable = false
                        }
                        else {
                            isDisable = true
                        }

                    }

                    //console.log(day.getDate(), day.getMonth(), today.getDate(), today.getMonth())
                }
                return (
                    <Stack display={'flex'} spacing={1} direction={'row'} height={25} width={'80%'} >
                        <Button color='error' endIcon={<Cancel />} sx={{ fontSize: 10 }} variant='outlined' size='small' disabled={isDisable} onClick={() => handleCancelletion(isDisable, row)} >Cancel</Button>

                    </Stack >
                )
            },
            ignoreRowClick: true,
            maxWidth: '150px',
            center: true,


        },
    ];

    const updateSearch = () => {
        if (historyLogSearch.fromDate === null || historyLogSearch === null) {
            setDateError(true)
        }
        else {
            setDateError(false)
            axios.post('/api/historylogapplication', { ...historyLogSearch, emp_id: userDetails.employee_id })
                .then((result) => {
                    //console.log(result.data)
                    setShowRecord(true)
                    setHistoryLogData(result.data)
                })
                .catch((err) => toast.error(err.response.data))
        }

    }

    const handleHistoryLogSearch = (e) => {
        e.preventDefault()
        //console.log(historyLogSearch)
        updateSearch()


    }
    const handleCancelletion = (disabled, row) => {
        //console.log(disabled, row)
        if (!disabled) {
            toast.promise(axios.post('/api/cancelapplication', row),
                {
                    pending: {
                        render() {
                            return ('Cancelling Application request')
                        }
                    },
                    success: {
                        render(res) {
                            updateSearch()
                            return (`${res.data.data} `)
                        }
                    },
                    error: {
                        render(err) {
                            //console.log(err)
                            return (`${err.data.response.data}`)
                        }
                    }
                })

        }
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
                                        <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Typography variant='p' component={'h5'} color={'red'}  >*Policies.</Typography>
                                            <Paper elevation={1} sx={{ p: 1, "&:hover": { boxShadow: 8 } }}>
                                                <Stack spacing={0.3}>
                                                    <Typography variant='p' component={'h5'} textAlign={'justify'} >* Cancel link would be provided for each leave / permission until month end..</Typography>
                                                    <Typography variant='p' component={'h5'} textAlign={'justify'} >* Once leaves are updated, cancel link would not be available. They need to approach admin for that.</Typography>
                                                    <Typography variant='p' component={'h5'} textAlign={'justify'} >* Cancellation requires reporting head approval, if the leave / permission is already approved.</Typography>
                                                </Stack>
                                            </Paper>


                                        </Container>


                                        <Container component={'form'} onSubmit={handleHistoryLogSearch} sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center', mt: 4, height: '100%', width: '100%', }}>
                                            <Stack spacing={2}  >
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
                                                            pagination
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

export default HistoryLog