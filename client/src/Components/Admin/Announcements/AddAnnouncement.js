import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material';

import axios from 'axios';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event'; // Import the calendar icon
import dayjs from 'dayjs';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import AccessNavBar from '../../Comman/NavBar/AccessNavBar';


function AddAnnouncement() {
    const [addAnnouncement, setAddAnnouncement] = useState({
        companyId: '',
        companyName: '',
        department:[],
        description: '',
        title: '',
        from_date: null,
        to_date: null,
        notify:'no'
    });
    const [dateError, setDateError] = useState(false)
    const [companyNames, setCompanyNames] = useState([])
    const [inputValue, setInputValue] = useState('')
    //taking companay names from db
    useEffect(() => {
        axios.get('/api/companynames')
            .then(res => {
                //console.log(res.data)
                setCompanyNames(res.data)
            })
            .catch(() => toast.error('unable to get company names!'))
    }, [])


    //

    const handleAddFormData = (e) => {
        const { name, value } = e.target;
        //console.log(name,value)
        setAddAnnouncement({ ...addAnnouncement, [name]: value });
    };

    const handleResetAnnouncementForm = () => {
        setAddAnnouncement({
            companyId: '',
            companyName: '',
            department:[],
            description: '',
            title: '',
            from_date: null,
            to_date: null,
            notify:'no'
        });
    };




    const handleSubmitAnnouncementForm = async (e) => {
        e.preventDefault();
        //console.log(addAnnouncement)
        if (addAnnouncement.from_date ===null || addAnnouncement.to_date===null) {
            setDateError(true)
        }
        else {
            setDateError(false)
            toast.promise(
                axios.post('/api/addannouncement', {...addAnnouncement,department:addAnnouncement.department.map(dep=>dep.value)}),
                {
                    pending: {
                        render() {
                            return ('Adding Announcement');
                        },
                    },
                    success: {
                        render(res) {
                            handleResetAnnouncementForm()
                            return (res.data.data);
                        },
                    },
                    error: {
                        render(err) {
                            return (err.data.response.data);
                        },
                    },
                }
            );
        }
    }

    const options = [{ name:'Management', value:'management' },
    {  name:'Software', value:'software' },
    { name: 'AI Labelling', value: 'ai labelling' },
    { name:'Accounts', value:'accounts'},
    { name:'HR', value:'hr' },
    { name:'IT', value:'it' },
    ]


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
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Add Announcement</Typography>
                        <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} sm={12} lg={6}>
                                <Paper
                                    elevation={5}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: 'auto',
                                        p:2
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
                                            width: '100%',
                                            height: 'auto',
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
                                            
                                            <Autocomplete
                                                multiple
                                                options={options}
                                                inputValue={inputValue}
                                                disableCloseOnSelect
                                                value={addAnnouncement.department}
                                                isOptionEqualToValue={(option,value) => option.value===value.value}
                                                onChange={(_, newValue) => {
                                                    //console.log(newValue);
                                                    setAddAnnouncement({...addAnnouncement,department:newValue})
                                                  }}
                                                  onInputChange={(_, newInputValue) => {
                                                    //console.log(newInputValue)
                                                    setInputValue(newInputValue)
                                                  }}
                                            
                                                getOptionLabel={(option) => option.name}
                                                renderOption={(props, option, { selected }) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                                                            checkedIcon={<CheckBox fontSize="small" />}
                                                            style={{ marginRight: 8 }}
                                                            checked={selected}
                                                        />
                                                        {option.name}
                                                    </li>
                                                )}
                                                style={{ width: 'auto' }}
                                                renderInput={(params) => (
                                                    <TextField required={addAnnouncement.department.length===0}  {...params} size='small' label="Department"  />
                                                )}
                                            />
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
                                                    minRows={3}
                                                    maxRows={3}
                                                    placeholder="Enter Description"
                                                    onChange={handleAddFormData}
                                                    size='small'
                                                    inputProps={{ maxLength: 295 }}
                                                />
                                            </FormControl>



                                            <FormControl fullWidth sx={{ mb: 1 }} variant="outlined">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Stack direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }} spacing={2}>
                                                        <DatePicker

                                                            value={addAnnouncement.from_date ? dayjs(addAnnouncement.from_date) : null}
                                                            onChange={e => setAddAnnouncement({ ...addAnnouncement, from_date: e.$d.toLocaleDateString('en-CA') })}
                                                            slotProps={{ textField: { error: dateError, required: true, size: 'small' } }}
                                                            label="From Date"
                                                            format='DD/MM/YYYY'
                                                            maxDate={addAnnouncement.to_date ? dayjs(addAnnouncement.to_date) : null}
                                                            startIcon={<EventIcon />} // Calendar icon
                                                        />
                                                        <DatePicker
                                                            value={addAnnouncement.from_date ? dayjs(addAnnouncement.to_date) : null}
                                                            onChange={e => setAddAnnouncement({ ...addAnnouncement, to_date: e.$d.toLocaleDateString('en-CA') })}
                                                            slotProps={{ textField: { error: dateError, required: true, size: 'small' } }}
                                                            label="To Date"
                                                            format='DD/MM/YYYY'
                                                            minDate={addAnnouncement.from_date ? dayjs(addAnnouncement.from_date) : null}
                                                            startIcon={<EventIcon />} // Calendar icon
                                                        />

                                                    </Stack>


                                                </LocalizationProvider>

                                            </FormControl>
                                            <Stack direction={'row'} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} spacing={3}>
                                                <FormLabel  required>Do you like to Notify through mail?</FormLabel>
                                                <FormControl>

                                                    <RadioGroup
                                                        row
                                                        value={addAnnouncement.notify}
                                                        name='notify'
                                                        onChange={handleAddFormData}


                                                    >
                                                        <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                                                    </RadioGroup>
                                                </FormControl>

                                            </Stack>

                                        </div>
                                        <Stack spacing={5} mt={1} direction="row" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
            </Box>

        </>
    );
}

export default AddAnnouncement;
