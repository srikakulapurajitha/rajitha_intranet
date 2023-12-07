import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import { toast } from 'react-toastify';


function FamilyInfo(props) {

    const {familyData, setFamilyData} = props

    const [prevData, setPrevData] = useState(familyData)

    const { userDetails } = useContext(UserContext)

    

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setFamilyData({ ...familyData, [name]: value })
    };

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        console.log(familyData)
        //console.log(JSON.stringify(prevData)===JSON.stringify(familyData))
        if (userDetails && JSON.stringify(prevData)!==JSON.stringify(familyData)){
            
            toast.promise(
                axios.post('/api/addfamilyinformation', { ...familyData, emp_id: userDetails.employee_id }),
                {

                    pending: {
                        render() {
                            return('Adding Family Information')
                        }
                    },
                    success: {
                        render(res) {
                            setPrevData(familyData)
                            return(res.data.data)
                        }
                    },
                    error: {
                        render(err) {
                            return(err.data.response.data)
                        }
                    }
                }

            )

        }
    
    };

    return (

        <>
            <form onSubmit={handleInfoSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="p" component={'h5'} mt={1} textAlign={'center'}> Family Information</Typography>
                    <Stack direction="column" m={1}
                        spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}
                    >
                        <TextField
                            placeholder="Name of spouse"
                            label="Name of spouse"
                            fullWidth
                            required
                            size='small'
                            name='spouse_name'
                            value={familyData.spouse_name}
                            onChange={handleInfoChange}
                        />


                        <TextField
                            placeholder="No. of Kid(s)"
                            label="No. of Kid(s)"
                            variant="outlined"
                            type='number'
                            fullWidth
                            size='small'
                            name='no_of_kids'
                            value={familyData.no_of_kids}
                            onChange={handleInfoChange}
                        />
                        <TextField
                            label="Kid(s) Names"
                            size="small"
                            multiline
                            rows={4}
                            placeholder="Kids(s) Names"
                            variant="outlined"
                            fullWidth
                            helperText="add kid(s) name seperated with commans"
                            name='kids_names'
                            value={familyData.kids_names}
                            onChange={handleInfoChange}


                        />
                        <Stack direction={'row'} spacing={2}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        slotProps={{ textField: { size: 'small' } }}
                                        maxDate={dayjs(new Date())}
                                        name='anniversary_date'
                                        format='DD/MM/YYYY'
                                        value={familyData.anniversary_date !== null ? dayjs(familyData.anniversary_date) : null}
                                        onChange={e => {

                                            if (e !== null) {
                                                console.log(new Date(e.$d).toLocaleString('en-CA').slice(0, 10))
                                                setFamilyData({ ...familyData, anniversary_date: new Date(e.$d).toLocaleString('en-CA').slice(0, 10) })
                                            }
                                        }
                                        }
                                        label="Anniversary Date" />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl sx={{ width: '25ch' }}>
                                <InputLabel size='small'>Blood Group</InputLabel>
                                <Select
                                    size='small'
                                    label='Blood Group'
                                    name='blood_group'
                                    value={familyData.blood_group}
                                    onChange={handleInfoChange}

                                >
                                    {
                                        ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group => (
                                            <MenuItem key={group} value={group}>{group}</MenuItem>
                                        )))
                                    }
                                </Select>
                            </FormControl>
                        </Stack>

                    </Stack>
                    <Button type="submit"size='small' variant="contained" color='success' >
                        Submit
                    </Button>
                </Box>
                
            </form>
            {/* <Loader loader={loader} /> */}
        </>


    );
}

export default FamilyInfo