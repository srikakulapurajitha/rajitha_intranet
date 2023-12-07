import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack,  Typography } from '@mui/material';
import AdminNavBar from '../../Comman/NavBar/AdminNavBar';
import axios from 'axios';
import {toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event'; // Import the calendar icon
import dayjs from 'dayjs';


function AddAnnouncement() {
    const [addAnnouncement, setAddAnnouncement] = useState({
        companyId: '',
        companyName: '',
        description: '',
        title: '',
        from_date: null, 
        to_date:null
    });
    const [dateError, setDateError] = useState(false)
    const [companyNames, setCompanyNames] = useState([])
    //taking companay names from db
    useEffect(() => {
        axios.get('/api/companynames')
            .then(res => {
                //console.log(res.data)
                setCompanyNames(res.data)
            })
            .catch(()=>toast.error('unable to get company names!'))
    },[])


    //

    const handleAddFormData = (e) => {
        const { name, value } = e.target;
        setAddAnnouncement({ ...addAnnouncement, [name]: value });
    };

    const handleResetAnnouncementForm = () => {
        setAddAnnouncement({
            companyId: '',
            companyName: '',
            description: '',
            title: '',
            from_date: null,
            to_date:null
        });
    };




    const handleSubmitAnnouncementForm = async (e) => {
        e.preventDefault();
        console.log(addAnnouncement)
        if (!addAnnouncement.from_date) {
            setDateError(true)
        }
        else {
            setDateError(false)
            toast.promise(
                axios.post('/api/addannouncement', addAnnouncement),
                {
                    pending: {
                        render() {
                            return('Adding Announcement');
                        },
                    },
                    success: {
                        render(res) {
                            handleResetAnnouncementForm()
                            return(res.data.data);
                        },
                    },
                    error: {
                        render(err) {
                            return(err.data.response.data);
                        },
                    },
                }
            );
        }
    }


    return (
        <>
            <AdminNavBar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 8 } }}>
                <div
                    style={{
                        height: '80vh',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Grid
                        container
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Grid item sm={12} lg={12} md={12}>
                            <Typography variant="h5" component={'h5'} m={1} textAlign={'center'}>
                                Add Announcement
                            </Typography>
                            <Paper
                                elevation={5}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: { xs: '30ch', md: '50ch', lg: '50ch' },
                                    height: { xs: '55ch', md: '55ch', lg: '55ch' },
                                }}
                            >
                                <Box
                                    component="form"
                                    onSubmit={handleSubmitAnnouncementForm}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: { xs: '25ch', md: '40ch', lg: '40ch' },
                                        height: { sm: '25ch', md: '50ch', lg: '50ch' },
                                        p: 1,
                                    }}
                                >
                                    <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                                        <InputLabel size='small' required>Select Company</InputLabel>
                                        <Select
                                            label="Select Company"
                                            name="companyName"
                                            value={addAnnouncement.companyName}
                                            required
                                            size='small'
                                            onChange={e => {
                                                const compId = companyNames.filter(c => c.company_name === e.target.value)
                                                setAddAnnouncement({ ...addAnnouncement, companyName: e.target.value, companyId: compId[0].id })
                                            }}
                                        >
                                            {companyNames.map((name, index) => <MenuItem key={index} value={name.company_name}>{name.company_name}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                        <InputLabel size='small' required>
                                            Title
                                        </InputLabel>
                                        <OutlinedInput
                                            name="title"
                                            value={addAnnouncement.title}
                                            required={true}
                                            type={'text'}
                                            label="Title"
                                            placeholder="Enter Title"
                                            onInput={handleAddFormData}
                                            size='small'
                                        />
                                    </FormControl>

                                    <div>
                                        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                            <InputLabel size='small' required >
                                                Description
                                            </InputLabel>
                                            <OutlinedInput
                                                name="description"
                                                value={addAnnouncement.description}
                                                required={true}
                                                multiline
                                                type="text"
                                                label="Description"
                                                minRows={5}
                                                maxRows={5}
                                                placeholder="Enter Description"
                                                onChange={handleAddFormData}
                                                size='small'
                                            />
                                        </FormControl>
                                        
                                        

                                        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack direction={{xs:'column',sm:'column',md:'row',lg:'row'}} spacing={2}>
                                                <DatePicker
                                                
                                                    value={addAnnouncement.from_date ? dayjs(addAnnouncement.from_date) : null}
                                                    onChange={e => setAddAnnouncement({ ...addAnnouncement, from_date: e.$d.toLocaleDateString('en-CA') })}
                                                    slotProps={{ textField: { error: dateError, required: true,size:'small' } }}
                                                    label="From Date"
                                                    format='DD/MM/YYYY'
                                                    maxDate={addAnnouncement.to_date ? dayjs(addAnnouncement.to_date) : null}
                                                    startIcon={<EventIcon />} // Calendar icon
                                                />
                                                 <DatePicker
                                                    value={addAnnouncement.from_date ? dayjs(addAnnouncement.to_date) : null}
                                                    onChange={e => setAddAnnouncement({ ...addAnnouncement, to_date: e.$d.toLocaleDateString('en-CA') })}
                                                    slotProps={{ textField: { error: dateError, required: true ,size:'small'} }}
                                                    label="To Date"
                                                    format='DD/MM/YYYY'
                                                    minDate={addAnnouncement.from_date ? dayjs(addAnnouncement.from_date) : null}
                                                    startIcon={<EventIcon />} // Calendar icon
                                                />

                                                </Stack>

                                               
                                            </LocalizationProvider>

                                        </FormControl>
                                    </div>
                                    <Stack spacing={5} direction="row" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <Button variant="outlined" color="success" type="submit">
                                            ADD
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={handleResetAnnouncementForm}>
                                            Clear
                                        </Button>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Box>
            
        </>
    );
}

export default AddAnnouncement;
