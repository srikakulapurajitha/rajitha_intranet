import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import AccessNavBar from '../NavBar/AccessNavBar'

function ApplyLeave() {
    const { userDetails } = useContext(UserContext)
    const [applicationForm, setApplicationForm] = useState({
        reporting_head_name: '',
        mail_approved_by: '',
        balance_leaves: 0,
        to_be_approved_leaves: 0,
        cc_mail: '',
        leave_type: '',
        leave_options: '',
        from_date: '',
        to_date: '',
        selected_dates: [],
        half_day: '',
        total_leaves: 0,
        reason: '',
        applicant_emp_id: '',
        applicant_name: '',
        applicant_email: ''

    })

    const [selectedRangeOfDates, setSelectedRangeOfDates] = useState({})
    const [reset, setReset] = useState(false)
    //const [reportingHead, setReportingHead] = useState('')

    useEffect(() => {
        if (userDetails) {
            const fetchData = async () => {
                try {
                    const head = await axios.post('/api/getreportinghead', { emp_id: userDetails.employee_id })
                    const pending = await axios.post('/api/pendingleaves', { emp_id: userDetails.employee_id })
                    const balance = await axios.post('/api/getbalanceleaves', { emp_id: userDetails.employee_id })
                    //console.log(head, pending, balance)
                    if(head.data.length!==0 && pending.data.length !==0 && balance.data.length !==0){
                        setApplicationForm({
                            reporting_head_name: head.data[0].name,
                            mail_approved_by: head.data[0].email,
                            balance_leaves: balance.data.totalLeaves,
                            to_be_approved_leaves: pending.data[0].pending_leaves,
                            cc_mail: '',
                            leave_type: '',
                            leave_options: '',
                            from_date: '',
                            to_date: '',
                            selected_dates: [],
                            half_day: '',
                            total_leaves: 0,
                            reason: '',
                            applicant_emp_id: '',
                            applicant_name: '',
                            applicant_email: ''
                        })
                    }
                    

                }
                catch (err) {
                    //console.log(err)
                    toast.error(err.response.data)

                }

            }
            fetchData()

        }

    }, [userDetails, reset])

    const LeavesTypes = {
        Casual: ['NA'],
        Special: ['Marriage', 'Death', 'Paternity',]
    }

    const getDateRange = (startDate, endDate) => {
        const date = new Date(startDate.getTime())
        //console.log(date)
        //const dates = []
        const dates = {}

        while (date <= endDate) {
            //dates.push(new Date(date).toLocaleString('en-CA').slice(0,10));
            dates[new Date(date).toLocaleString('en-CA').slice(0, 10)] = true
            date.setDate(date.getDate() + 1);
        }

        return dates;

    }

    const handleDateChange = (e) => {

        const { name, value } = e.target
        //console.log(name, value)

        if (name === 'from_date' && value !== '' && applicationForm.to_date !== '') {
            //console.log('selected', applicationForm.selected_dates)
            const st_date = new Date(value)
            const end_date = new Date(applicationForm.to_date)
            const dateRange = getDateRange(st_date, end_date)
            if (applicationForm.half_day !== '' && applicationForm.half_day.length === 10) {
                //console.log(applicationForm.half_day.length)
                dateRange[applicationForm.half_day] = false

            }
            const selected = []
            Object.keys(dateRange).forEach(date => {
                if (dateRange[date]) {
                    selected.push(date)
                }

            });
            //console.log('selected', selected)
            setApplicationForm({ ...applicationForm, [name]: value, selected_dates: selected, total_leaves: selected.length + (applicationForm.half_day === '' ? 0 : 0.5) })
            setSelectedRangeOfDates(dateRange)


        }
        else if (name === 'to_date' && value !== '' && applicationForm.from_date !== '') {
            const st_date = new Date(applicationForm.from_date)
            const end_date = new Date(value)
            const dateRange = getDateRange(st_date, end_date)
            if (applicationForm.half_day !== '' && applicationForm.half_day.length === 10) {
                //console.log(applicationForm.half_day.length)
                dateRange[applicationForm.half_day] = false

            }
            const selected = []
            Object.keys(dateRange).forEach(date => {
                if (dateRange[date]) {
                    selected.push(date)
                }

            });
            //console.log('selected', selected)
            setApplicationForm({ ...applicationForm, [name]: value, selected_dates: selected, total_leaves: selected.length + (applicationForm.half_day === '' ? 0 : 0.5) })
            setSelectedRangeOfDates(dateRange)

        }
        else {
            setApplicationForm({ ...applicationForm, [name]: value, selected_dates: [], total_leaves: (applicationForm.half_day === '' ? 0 : 0.5) })
            setSelectedRangeOfDates({})
        }

    }

    const handleDateSelection = (e) => {
        //console.log(applicationForm.selected_dates)
        const selected = []
        Object.keys(selectedRangeOfDates).forEach(date => {

            //console.log('check', date, e.target.name === date, selectedRangeOfDates[e.target.name])
            if (e.target.name === date && !selectedRangeOfDates[e.target.name]) {

                selected.push(date)

            }
            else if (e.target.name !== date && selectedRangeOfDates[date]) {
                selected.push(date)
            }

            //console.log(date)



        });
        //console.log('selected', selected)
        //setCheckedDates(selected)
        setSelectedRangeOfDates({ ...selectedRangeOfDates, [e.target.name]: !selectedRangeOfDates[e.target.name] })
        setApplicationForm({ ...applicationForm, selected_dates: selected, total_leaves: selected.length + (applicationForm.half_day === '' ? 0 : 0.5) })
    }

    const handleHalfDayChange = (e) => {
        if (e.target.value !== '' && e.target.value.length === 10) {
            const selected = []
            //console.log(selectedRangeOfDates)
            Object.keys(selectedRangeOfDates).forEach(date => {

                //console.log('check', date, e.target.value === date)

                if (e.target.value !== date && selectedRangeOfDates[date]) {
                    selected.push(date)
                }

                //console.log(date)



            });
            //console.log('selected', selected)
            if (applicationForm.from_date !== '' && applicationForm.to_date !== '') {
                setSelectedRangeOfDates({ ...selectedRangeOfDates, [e.target.value]: false })

            }


            setApplicationForm({ ...applicationForm, half_day: e.target.value, selected_dates: selected, total_leaves: selected.length + 0.5 })
        }
        else {

            setApplicationForm({ ...applicationForm, half_day: e.target.value, total_leaves: applicationForm.total_leaves - 0.5 })

        }
        //console.log(applicationForm.total_leaves+(e.target.value===''?0:0.5))

    }

    const handleApplicationSubmit = (e) => {
        e.preventDefault()
        //console.log(applicationForm)

        if (applicationForm.total_leaves === 0) {
            toast.warning('select the dates for fullday or half day leave')
        }
        else {
            let error = false
            if (applicationForm.cc_mail !== '') {
                const mails = applicationForm.cc_mail.split(',')
                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                for (let i = 0; i < mails.length; i++) {
                    if (!emailPattern.test(mails[i])) {
                        error = true
                        break

                    }

                }

            }
            if (!error) {
                toast.promise(axios.post('/api/applyforleave', { ...applicationForm, applicant_emp_id: userDetails.employee_id, applicant_name: `${userDetails.first_name} ${userDetails.last_name}`, applicant_email: userDetails.email }),
                    {
                        pending: {
                            render() {
                                return ('Applying For Leave')
                            }
                        },
                        success: {
                            render(res) {
                                resetAppplication()
                                return (res.data.data)
                            }
                        },
                        error: {
                            render(err) {
                                return (err.data.response.data)
                            }
                        }
                    }
                )
            }
            else {
                toast.warning('"Cc" field was not recognized.Please make sure that all addresses are properly formed.')
            }

        }
            

}

const resetAppplication = () => {
    setApplicationForm({
        reporting_head_name: '',
        mail_approved_by: '',
        balance_leaves: 0,
        to_be_approved_leaves: 0,
        cc_mail: '',
        leave_type: '',
        leave_options: '',
        from_date: '',
        to_date: '',
        selected_dates: [],
        half_day: '',
        total_leaves: 0,
        reason: '',
        applicant_emp_id: '',
        applicant_name: '',
        applicant_email: ''
    })
    setSelectedRangeOfDates({})
    setReset(!reset)
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
                    <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Apply For Leave</Typography>
                    <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
                        <Grid item xs={12} sm={12} lg={10}>
                            <Paper elevation={10}>
                                <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                    <Typography variant='p' component={'h5'} color={'red'}  >*Policies.</Typography>
                                    <Paper elevation={1} sx={{ p: 1, "&:hover": { boxShadow: 8 } }}>
                                        <Stack spacing={0.3}>
                                            <Typography variant='p' component={'h5'} textAlign={'justify'} >* Leaves can be applied only 10 days before or 10 days after, from the leave date.</Typography>
                                            <Typography variant='p' component={'h5'} textAlign={'justify'} >* Uncheck your weekly offs from the listed days.</Typography>
                                            <Typography variant='p' component={'h5'} textAlign={'justify'} >* Cross check the form details before submitting the data.</Typography>
                                        </Stack>
                                    </Paper>


                                </Container>
                                <form onSubmit={handleApplicationSubmit}>
                                    <Container sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center', mt: 4, height: '100%', width: '100%', }}>
                                        <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' } }}>


                                            <Stack spacing={2} mb={2}>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel size="small" required>Your mail would be approved by</InputLabel>
                                                    <OutlinedInput
                                                        size="small"
                                                        name="approved by"
                                                        required={true}
                                                        value={applicationForm.mail_approved_by}
                                                        type={'text'}
                                                        label="Your mail would be approved by"
                                                        disabled
                                                    />
                                                </FormControl>
                                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Present balance leaves</InputLabel>
                                                        <OutlinedInput size="small" name="balance_leaves" value={applicationForm.balance_leaves} disabled required={true} type={"number"} label="Present balance leaves" />
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Leaves still to be approved</InputLabel>
                                                        <OutlinedInput size="small" name="last_name" value={applicationForm.to_be_approved_leaves} disabled required={true} type={"number"} label="Leaves still to be approved" />
                                                    </FormControl>
                                                </Stack>

                                                <FormControl fullWidth variant="outlined">

                                                    <TextField
                                                        size="small"
                                                        name="cc_mail"
                                                        multiline
                                                        minRows={3}
                                                        maxRows={3}
                                                        type={'text'}
                                                        value={applicationForm.cc_mail}
                                                        onChange={e => setApplicationForm({ ...applicationForm, cc_mail: e.target.value })}
                                                        label="Your mail would be Cc to"
                                                        helperText={<Typography fontSize={12} component={'span'} color={'red'}>Email addresses should be separated by ","</Typography>}


                                                    />

                                                </FormControl>
                                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Leave Type</InputLabel>
                                                        <Select name="leave_type" size="small" value={applicationForm.leave_type} onChange={e => setApplicationForm({ ...applicationForm, leave_type: e.target.value })} required label="Leave Type">
                                                            {
                                                                Object.keys(LeavesTypes).map((type, index) => (
                                                                    <MenuItem key={index} value={type}>{type}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Options</InputLabel>
                                                        <Select size="small" value={applicationForm.leave_options} onChange={e => setApplicationForm({ ...applicationForm, leave_options: e.target.value })} required label="Options">
                                                            {
                                                                LeavesTypes[applicationForm.leave_type] === undefined ? <MenuItem value='NA'>NA</MenuItem> :
                                                                    LeavesTypes[applicationForm.leave_type].map((options, index) => <MenuItem key={index} value={options}>{options}</MenuItem>)
                                                            }

                                                        </Select>
                                                    </FormControl>

                                                </Stack>


                                            </Stack>
                                        </Container>

                                        <Container >
                                            <Stack spacing={1.5}>
                                                <Stack direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }} spacing={2}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            type='date'
                                                            size='small'
                                                            label='From Date'
                                                            inputProps={{ max: applicationForm.to_date, }}
                                                            InputLabelProps={{ shrink: true, required: true }}
                                                            name='from_date'
                                                            value={applicationForm.from_date}
                                                            onChange={handleDateChange}

                                                        />
                                                    </FormControl>

                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            type='date'
                                                            size='small'
                                                            label='To Date'
                                                            inputProps={{ min: applicationForm.from_date, }}
                                                            InputLabelProps={{ shrink: true, required: true, }}
                                                            name='to_date'
                                                            value={applicationForm.to_date}
                                                            onChange={handleDateChange}

                                                        />
                                                    </FormControl>
                                                </Stack>
                                                <Box sx={{ height: '80px', border: '1px solid gray', borderRadius: '10px' }}>
                                                    <Typography variant='p' fontSize={9.5} component={'h5'} color={'red'} textAlign={'center'}  >(De-Select weekly offs / Holidays. Leaves would be applied for the checked dates)</Typography>
                                                    <Box sx={{ overflow: 'auto', height: '65%' }}>
                                                        <Grid container display={'flex'} justifyContent={'flex-start'} p={1} >
                                                            {
                                                                Object.keys(selectedRangeOfDates).length !== 0 ?

                                                                    Object.keys(selectedRangeOfDates).map((date, index) => (
                                                                        <Grid key={index} item xs={4} lg={4} >
                                                                            <FormControlLabel control={<Checkbox size='small' name={date} checked={selectedRangeOfDates[date]} disabled={date === applicationForm.half_day} onChange={handleDateSelection} />} label={<Typography fontSize={12}>{date}</Typography>} />

                                                                        </Grid>

                                                                    ))
                                                                    :
                                                                    <Typography >No dates selected</Typography>
                                                            }
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                                <Stack direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }} spacing={2}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            type='date'
                                                            size='small'
                                                            label='And / Or Half day'
                                                            InputLabelProps={{ shrink: true, required: true, }}
                                                            name='half_day'
                                                            value={applicationForm.half_day}
                                                            onChange={handleHalfDayChange}

                                                        />
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small"  >Total leaves applied now</InputLabel>
                                                        <OutlinedInput size="small" name="applied_leaves" value={applicationForm.total_leaves} disabled type={"number"} label="Total leaves applied now" />
                                                    </FormControl>
                                                </Stack>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel size="small" required  >Reason</InputLabel>
                                                    <OutlinedInput size="small" name="reason" value={applicationForm.reason} inputProps={{ maxLength: 300 }} onChange={e => setApplicationForm({ ...applicationForm, reason: e.target.value })} multiline minRows={3} maxRows={3} required type={"text"} label="Reason" placeholder="enter your leave application reason in (max:300 characters)" />
                                                </FormControl>
                                            </Stack>
                                        </Container >
                                    </Container>
                                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 0.2 }}>
                                        <Button sx={{ mb: 2 }} size='small' disabled={(applicationForm.mail_approved_by !== undefined && applicationForm.mail_approved_by !== '' ? false : true)} variant="contained" color="success" type="submit">
                                            Submit
                                        </Button>

                                    </Stack>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Box>
        </Box>

    </>
)
}

export default ApplyLeave