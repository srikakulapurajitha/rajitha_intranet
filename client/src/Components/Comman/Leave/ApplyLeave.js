import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import AdminNavBar from '../NavBar/AdminNavBar'
import UserNavBar from '../NavBar/UserNavBar'
import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Event } from '@mui/icons-material'

function ApplyLeave() {
    const { userDetails } = useContext(UserContext)
    const [applicationForm, setApplicationForm] = useState({
        mail_approved_by:'',
        balence_leaves:0,
        to_be_approved_leaves:0,
        cc_mail:[],
        leave_type:'',
        leave_options:'',
        from_date:'',
        to_date:'',
        selected_dates:[],
        half_day:[],
        total_leaves:0,
        reason:''
    })
    
    const [selectedRangeOfDates, setSelectedRangeOfDates] = useState({})
    const [checkedDates, setCheckedDates] = useState([])

    const getDateRange=(startDate, endDate)=>{
        const date = new Date(startDate.getTime())
        //console.log(date)
        //const dates = []
        const dates = {}

        while (date <= endDate) {
            //dates.push(new Date(date).toLocaleString('en-CA').slice(0,10));
            dates[new Date(date).toLocaleString('en-CA').slice(0,10)]=true
            date.setDate(date.getDate() + 1);
          }
        
          return dates;
        
    }

    const handleDateChange = (e) =>{
        
        const {name, value} = e.target
        console.log(name,value)
        
        if(name==='from_date'&& value!==''&& applicationForm.to_date!=='' ){
            console.log('selected',applicationForm.selected_dates)
            const st_date = new Date(value)
            const end_date = new Date(applicationForm.to_date)
            const dateRange = getDateRange(st_date,end_date)
            console.log('selected',dateRange)
            setApplicationForm({...applicationForm,[name]:value,selected_dates:Object.keys(dateRange)})
            setSelectedRangeOfDates(dateRange)


        }
        else if(name==='to_date'&& value!==''&& applicationForm.from_date!==''){
            const st_date = new Date(applicationForm.from_date)
            const end_date = new Date(value)
            const dateRange = getDateRange(st_date,end_date)
            console.log('selected',dateRange)
            setApplicationForm({...applicationForm,[name]:value,selected_dates:Object.keys(dateRange)})
            setSelectedRangeOfDates(dateRange)

        }
        else{
            setApplicationForm({...applicationForm,[name]:value,selected_dates:[]})
            setSelectedRangeOfDates({})
        }
        
        

    }

    const handleDateSelection = (e) =>{
        console.log(applicationForm.selected_dates)
        const selected = []
        Object.keys(selectedRangeOfDates).forEach(date => {
           
            console.log('check',date,e.target.name===date,selectedRangeOfDates[e.target.name] )
                if(e.target.name===date && !selectedRangeOfDates[e.target.name] ){
                    
                    selected.push(date)
                    
                }
                else if(e.target.name!==date&& selectedRangeOfDates[date]){
                    selected.push(date)
                }
            
                console.log(date)
    
            
            
        });
        console.log('selected',selected)
        //setCheckedDates(selected)
        setSelectedRangeOfDates({...selectedRangeOfDates,[e.target.name]: !selectedRangeOfDates[e.target.name]})
        setApplicationForm({...applicationForm,selected_dates:selected})
    }
    return (
        <>
            <Box sx={{ height: '100vh', width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
                {userDetails.access === 'admin' ? <AdminNavBar /> : <UserNavBar />}
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6, ml: { xs: 2 }, backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: '100%',
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
                                                <Typography variant='p' component={'h5'} textAlign={'left'} >* Leaves can be applied only 10 days before or 10 days after, from the leave date.</Typography>
                                                <Typography variant='p' component={'h5'} textAlign={'left'} >* Uncheck your weekly offs from the listed days.</Typography>
                                                <Typography variant='p' component={'h5'} textAlign={'left'} >* Cross check the form details before submitting the data.</Typography>

                                            </Stack>



                                        </Paper>


                                    </Container>
                                    <Container sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center', mt: 4, height: '100%', width: '100%', }}>
                                        <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' } }}>


                                            <Stack spacing={2} mb={2}>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel size="small" required>Your mail would be approved by</InputLabel>
                                                    <OutlinedInput
                                                        size="small"
                                                        name="approved by"
                                                        required={true}
                                                        value={'maheshs@brightcomgroup.com'}
                                                        type={'text'}
                                                        label="Your mail would be approved by"

                                                        disabled
                                                    />
                                                </FormControl>
                                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Present balance leaves</InputLabel>
                                                        <OutlinedInput size="small" name="balence_leaves" value={-2} disabled required={true} type={"number"} label="Present balance leaves" />
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Leaves still to be approved</InputLabel>
                                                        <OutlinedInput size="small" name="last_name" value={1} disabled required={true} type={"number"} label="Leaves still to be approved" />
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
                                                        label="Your mail would be Cc to"
                                                        helperText={'Email addresses should be separated by ","'}


                                                    />

                                                </FormControl>
                                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Leave Type</InputLabel>
                                                        <Select name="leave_type" size="small" value={applicationForm.leave_type} required label="Leave Type">
                                                            <MenuItem value='casual'>Casual Leave</MenuItem>
                                                            <MenuItem value='special'>Special Leave</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Options</InputLabel>
                                                        <Select name="gender" size="small" value={applicationForm.leave_options} required label="Options">
                                                            <MenuItem value='merrage'>Marriage</MenuItem>
                                                            <MenuItem value='death'>Death</MenuItem>
                                                            <MenuItem value='paternity'>Paternity</MenuItem>
                                                            <MenuItem value='sick'>Sick</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                </Stack>


                                            </Stack>
                                        </Container>

                                        <Container >

                                            <Stack spacing={1.5}>

                                                
                                                    
                                                        <Stack direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }} spacing={2}>
                                                            {/* <MobileDatePicker
                                                                slotProps={{ textField: { required: true, size: 'small' } }}
                                                                value={applicationForm.from_date}
                                                                label="From Date"
                                                                format='DD/MM/YYYY'
                                                                onChange={handleDateChange}


                                                            /> */}
                                                            <FormControl fullWidth variant="outlined">
                                                            <TextField
                                                            type='date'
                                                            size='small'
                                                           
                                                            label='From Date'
                                                            inputProps={{max:applicationForm.to_date}}
                                                            InputLabelProps={{ shrink: true, required: true,  }}
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
                                                            inputProps={{min:applicationForm.from_date,}}
                                                            InputLabelProps={{ shrink: true, required: true,  }}
                                                            name='to_date'
                                                            value={applicationForm.to_date}
                                                            onChange={handleDateChange}

                                                            />

                                                            </FormControl>

                                                        </Stack>


                                                   

                                               
                                                <Box sx={{ height: '80px', border: '1px solid gray', borderRadius: '10px' }}>
                                                    <Typography variant='p' fontSize={9.5} component={'h5'} color={'red'} textAlign={'center'}  >(De-Select weekly offs / Holidays. Leaves would be applied for the checked dates)</Typography>
                                                    <Box sx={{overflow:'auto',height:'65%'}}>
                                                        <Grid container display={'flex'} justifyContent={'flex-start'} p={1} >
                                                            {
                                                                Object.keys(selectedRangeOfDates).length!==0?

                                                                Object.keys(selectedRangeOfDates).map((date)=>(
                                                                    <Grid item xs={4} lg={4} >
                                                            <FormControlLabel control={<Checkbox size='small' name={date} checked={selectedRangeOfDates[date]} onChange={handleDateSelection} />} label={<Typography fontSize={12}>{date}</Typography>} />

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
                                                            inputProps={{min:applicationForm.to_date}}
                                                            InputLabelProps={{ shrink: true, required: true,  }}
                                                            name='half_day'
                                                            value={applicationForm.half_day}
                                                            onChange={handleDateChange}

                                                            />



                                                        
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small"  >Total leaves applied now</InputLabel>
                                                        <OutlinedInput size="small" name="applied_leaves" value={1.5} disabled type={"number"} label="Total leaves applied now" />
                                                    </FormControl>
                                                </Stack>


                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel size="small" required  >Reason</InputLabel>
                                                    <OutlinedInput size="small" name="reason" multiline minRows={3} maxRows={3} required type={"text"} label="Reason" placeholder="enter your leave application purpose" />
                                                </FormControl>



                                            </Stack>

                                        </Container >



                                    </Container>
                                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 0.2 }}>
                                        <Button sx={{ mb: 2 }} size='small' variant="contained" color="success" type="submit">
                                            Submit
                                        </Button>

                                    </Stack>




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