import { Badge, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Stack, TextField, Typography, Select, Autocomplete, Checkbox, FormControlLabel, Switch, Collapse, FormHelperText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AccountBalanceWallet, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'
import axios from 'axios'
import Loader from '../../Comman/Loader'
import DataTable from 'react-data-table-component'
import { toast } from 'react-toastify'
import { styled } from '@mui/material/styles';
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'

const columns = [
    {
        name: 'Credit',
        selector: row => row.credit,
        center: 'true',
        maxWidth: '20px'

    },
    {
        name: 'Debit',
        selector: row => row.debit,
        center: 'true',

    },
    {
        name: 'Date',
        selector: row => new Date(row.date).toLocaleString('en-CA').slice(0, 10),
        center: 'true',
        sortable: 'true',

    },

    {
        name: 'Total Leaves',
        selector: row => row.total_leaves,
        center: 'true',

    },
    {
        name: 'Reference/Application id',
        selector: row => row.reference,
        center: 'true',
        minWidth: '300px'

    },

];

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('avatar.png')  `,
                backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '80%',



            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: 'white',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '100%',
            backgroundImage: `url('group.png')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));


function ManageBalanceLeaves() {
    
    const [loader, setLoader] = useState(true)
    const [users, setUsers] = useState([])
    const [currentBalance, setCurrentBalance] = useState('')
    const [companyNames, setCompanyNames] = useState([])
    const [mode, setMode] = useState('multiple')

    const [singleModeManageFields, setSingleModeManageFields] = useState({
        emp_id: '',
        manageType: '',
        no_of_leaves: 0,
        date: new Date().toLocaleString('en-CA').slice(0,10),
        reference: '',
        totalLeaves: 0,
        selectedUser: null
    })

    const [multipleModeManageFields, setMultipleModeManageFields] = useState({
        company_name: '',
        manage_type: '',
        departments: [],
        no_of_leaves: 0,
        date: new Date().toLocaleString('en-CA').slice(0,10),
        reference: '',
        auto: false,
        carrie_forward_leaves: 0

    })
    const [inputValue, setInputValue] = useState('')



    const options = [{ name: 'Management', value: 'management' },
    { name: 'Software', value: 'software' },
    { name: 'AI Labelling', value: 'ai labelling' },
    { name: 'Accounts', value: 'accounts' },
    { name: 'HR', value: 'hr' },
    { name: 'IT', value: 'it' },
    ]


    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const userData = await axios.get('/api/getemployeedata')
                //console.log(userData)
                setUsers(userData.data)
                axios.get('/api/companynames')
                    .then(res => {
                        
                        setCompanyNames(res.data)
                    })
                setLoader(false)
            }
            catch(err) {
                toast.error(err.response.data)
            }
        }
        fetchUserData()
    }, [])

    const handleUserSelection = (_, newValue) => {
        //console.log(newValue)
        if (newValue !== null) {
            const { value } = newValue
            setLoader(true)
            axios.post('/api/getbalanceleaves', { emp_id: value.employee_id })
                .then(res => {
                    //console.log(res.data)
                    setLoader(false)
                    setCurrentBalance(res.data)
                    setSingleModeManageFields({ ...singleModeManageFields, selectedUser: newValue, emp_id: value.employee_id, totalLeaves: res.data.totalLeaves })
                })
                .catch(() => {
                    setLoader(false)
                    toast.error('not able to fetch data!')
                })
        }
        else {
           
            setCurrentBalance('')
            setSingleModeManageFields({ ...singleModeManageFields, totalLeaves: [],selectedUser:null })

        }

    }

    const handleSingleModeSubmit = (e) => {
        e.preventDefault()

        let total;
        const { manageType, totalLeaves, no_of_leaves } = singleModeManageFields
        if (manageType === 'credit') {
            total = Number(totalLeaves) + Number(no_of_leaves)
        }
        else {
            total = Number(totalLeaves) - Number(no_of_leaves)
        }
        toast.promise(axios.post('/api/manageleaves', { ...singleModeManageFields, totalLeaves: total }), {
            pending: {
                render() {
                    return ('Adding Record')
                }
            },
            success: {
                render(res) {
                    handleSingleModeClear()
                    return (res.data.data)
                }
            },
            error: {
                render(err) {
                    return (err.data.response.data)
                }
            }
        })
    }

    const handleSingleModeClear = () => {
        setSingleModeManageFields({
            emp_id: '',
            manageType: '',
            no_of_leaves: '',
            date: new Date().toLocaleString('en-CA').slice(0,10),
            reference: '',
            totalLeaves: 0,
            selectedUser: null

        })

        setCurrentBalance('')
    }

    const handleMultipleModeSubmit = (e) => {
        e.preventDefault()
        //console.log(multipleModeManageFields)
        if (multipleModeManageFields.auto && multipleModeManageFields.manage_type === 'debit') {
            toast.warning('Auto annual maintenance work with Manage Type credit only')
        }
        else {
            toast.promise(axios.post('/api/managedepartmentsleaves', { ...multipleModeManageFields, no_of_leaves: Number(multipleModeManageFields.no_of_leaves), carrie_forward_leaves: Number(multipleModeManageFields.carrie_forward_leaves), departments: multipleModeManageFields.departments.map(dep => dep.value) }), {
                pending: {
                    render() {

                        return ('Adding Record')
                    }
                },
                success: {
                    render(res) {
                        handleMultipleModeClear()
                        return (res.data.data)
                    }
                },
                error: {
                    render(err) {
                        return (err.data.response.data)
                    }
                }
            })

        }
    }

    const handleMultipleModeClear = () => {
        setMultipleModeManageFields({
            company_name: '',
            manage_type: '',
            departments: [],
            no_of_leaves: 0,
            date: new Date().toLocaleString('en-CA').slice(0,10),
            reference: '',
            auto: false,
            carrie_forward_leaves: 0

        })

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
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Manage Balance Leaves</Typography>
                        <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} sm={12} lg={10}>


                                <Paper elevation={10}>
                                    <Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <FormControlLabel
                                            control={<MaterialUISwitch sx={{ m: 1 }} onChange={e => {
                                                handleMultipleModeClear()
                                                handleSingleModeClear()
                                                e.target.checked ? setMode('single') : setMode('multiple')
                                            }}

                                            />}
                                            label="Change Mode"
                                        />
                                    </Container>
                                    {
                                        <Container>
                                            <Collapse in={mode === 'multiple'} timeout={'auto'} unmountOnExit>

                                                <form onSubmit={handleMultipleModeSubmit}>
                                                    <Stack spacing={2}>
                                                        <Stack direction={{ lg: 'row', xs: 'column' }} spacing={2}>
                                                            <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                                                                <InputLabel size='small' required>Select Company</InputLabel>
                                                                <Select
                                                                    label="Select Company"
                                                                    name="companyName"
                                                                    value={multipleModeManageFields.company_name}
                                                                    required
                                                                    size='small'
                                                                    onChange={e => setMultipleModeManageFields({ ...multipleModeManageFields, company_name: e.target.value })}
                                                                >
                                                                    {companyNames.map((name, index) => <MenuItem key={index} value={name.company_name}>{name.company_name}</MenuItem>)}
                                                                </Select>
                                                            </FormControl>

                                                            <FormControl fullWidth >
                                                                <InputLabel size='small' required>Manage Type</InputLabel>

                                                                <Select required size='small' label='Manage Type' value={multipleModeManageFields.manage_type} onChange={e => setMultipleModeManageFields({ ...multipleModeManageFields, manage_type: e.target.value })} >
                                                                    <MenuItem value='credit'>Credit</MenuItem>
                                                                    <MenuItem value='debit'>Debit</MenuItem>
                                                                </Select>

                                                            </FormControl>

                                                        </Stack>

                                                        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                                            <Autocomplete
                                                                multiple
                                                                options={options}
                                                                inputValue={inputValue}
                                                                disableCloseOnSelect
                                                                value={multipleModeManageFields.departments}
                                                                isOptionEqualToValue={(option, value) => option.value === value.value}

                                                                onChange={(_, newValue) => {
                                                                    //console.log(newValue);
                                                                    setMultipleModeManageFields({ ...multipleModeManageFields, departments: newValue })
                                                                }}
                                                                onInputChange={(_, newInputValue) => {
                                                                    //console.log(newInputValue)
                                                                    setInputValue(newInputValue)
                                                                }}

                                                                getOptionLabel={(option) => option.name || " "}
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
                                                                    <TextField  {...params} size='small' label="Select Departments" />
                                                                )}
                                                            />
                                                        </FormControl>

                                                        <Stack direction={{ lg: 'row', xs: 'column' }} spacing={2}>

                                                            <FormControl fullWidth  >
                                                                <TextField
                                                                    type='number'
                                                                    size='small'
                                                                    inputProps={{ min: 0, step: 0.5 }}
                                                                    required
                                                                    value={multipleModeManageFields.no_of_leaves}
                                                                    onChange={e => setMultipleModeManageFields({ ...multipleModeManageFields, no_of_leaves: e.target.value })}
                                                                    label='No of Leaves'
                                                                />
                                                            </FormControl>

                                                            <FormControl fullWidth  >
                                                                <TextField
                                                                    type='date'
                                                                    size='small'
                                                                    required
                                                                    disabled
                                                                    value={multipleModeManageFields.date}
                                                                    //onChange={e => setMultipleModeManageFields({ ...multipleModeManageFields, date: e.target.value })}
                                                                    label='Date'
                                                                    InputLabelProps={{ shrink: true, required: true }}

                                                                />
                                                            </FormControl>

                                                            <FormControl fullWidth >
                                                                <TextField
                                                                    size='small'
                                                                    placeholder='Enter Reference ex:annual leaves'
                                                                    value={multipleModeManageFields.reference}
                                                                    onChange={e => setMultipleModeManageFields({ ...multipleModeManageFields, reference: e.target.value })}
                                                                    required
                                                                    label='Reference'
                                                                />
                                                            </FormControl>
                                                        </Stack>

                                                        <Stack direction={{ lg: 'row', xs: 'column' }} >
                                                            <FormControl fullWidth >
                                                                <FormControlLabel
                                                                    control={<Checkbox checked={multipleModeManageFields.auto} onChange={e => setMultipleModeManageFields({ ...multipleModeManageFields, auto: e.target.checked })} />}
                                                                    label="Auto Annual Maintenance"
                                                                />
                                                            </FormControl>

                                                            <FormControl fullWidth error={multipleModeManageFields.auto}>

                                                                <TextField
                                                                    type='number'
                                                                    size='small'
                                                                    inputProps={{ min: 0, step: 0.5, max:60 }}
                                                                    required
                                                                    value={multipleModeManageFields.carrie_forward_leaves}
                                                                    onChange={e => setMultipleModeManageFields({ ...multipleModeManageFields, carrie_forward_leaves: e.target.value })}
                                                                    label='No. Carrie Forwarded Leaves'
                                                                    disabled={!multipleModeManageFields.auto}
                                                                />
                                                                <FormHelperText>Note: auto maintenance will add extra carrie forwarded number of leaves if available </FormHelperText>
                                                            </FormControl>
                                                        </Stack>

                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} >
                                                            <Stack direction={'row'} spacing={3} marginBottom={3}>
                                                                <Button size='small' variant='contained' color='error' onClick={handleMultipleModeClear}>
                                                                    Clear
                                                                </Button>
                                                                <Button type='submit' size='small' variant='contained' color='success'>
                                                                    Submit
                                                                </Button>
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                </form>
                                            </Collapse>

                                            <Collapse in={mode === 'single'} unmountOnExit timeout={'auto'}>
                                                <form onSubmit={handleSingleModeSubmit}>

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

                                                                value={singleModeManageFields.selectedUser}
                                                                renderInput={(params) => <TextField size='small' {...params} required label="Select Employee" />}
                                                            />


                                                        </FormControl>

                                                        <Stack spacing={2} direction={{ lg: 'row', xs: 'column' }}  >
                                                            <FormControl fullWidth >
                                                                <InputLabel size='small' required>Manage Type</InputLabel>

                                                                <Select required size='small' label='Manage Type' value={singleModeManageFields.manageType} onChange={e => setSingleModeManageFields({ ...singleModeManageFields, manageType: e.target.value })} >
                                                                    <MenuItem value='credit'>Credit</MenuItem>
                                                                    <MenuItem value='debit'>Debit</MenuItem>
                                                                </Select>

                                                            </FormControl>

                                                            <FormControl fullWidth  >

                                                                <TextField
                                                                    type='number'
                                                                    size='small'
                                                                    inputProps={{ min: 0, step: 0.5,max:60 }}
                                                                    required
                                                                    value={singleModeManageFields.no_of_leaves}
                                                                    onChange={e => setSingleModeManageFields({ ...singleModeManageFields, no_of_leaves: e.target.value })}
                                                                    label='No of Leaves'
                                                                />
                                                            </FormControl>


                                                        </Stack>
                                                        <Stack spacing={2} direction={{ lg: 'row', xs: 'column' }}  >
                                                            <FormControl fullWidth  >

                                                                <TextField
                                                                    type='date'
                                                                    size='small'
                                                                    required
                                                                    value={singleModeManageFields.date}
                                                                    disabled
                                                                    //onChange={e => setSingleModeManageFields({ ...singleModeManageFields, date: e.target.value })}
                                                                    label='Date'
                                                                    InputLabelProps={{ shrink: true, required: true }}

                                                                />
                                                            </FormControl>
                                                            <FormControl fullWidth >

                                                                <TextField
                                                                    size='small'
                                                                    placeholder='Enter Reference ex:annual leaves'
                                                                    value={singleModeManageFields.reference}
                                                                    onChange={e => setSingleModeManageFields({ ...singleModeManageFields, reference: e.target.value })}
                                                                    required
                                                                    label='Reference'
                                                                />
                                                            </FormControl>
                                                        </Stack>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                                            <Stack spacing={3} direction={'row'}>
                                                                <Button size='small' variant='contained' color='error' onClick={handleSingleModeClear}>
                                                                    Clear
                                                                </Button>
                                                                <Button color='success' type='submit' size='small' variant='contained'>
                                                                    Submit
                                                                </Button>

                                                            </Stack>

                                                        </Box>
                                                    </Stack>
                                                </form>

                                                <Box sx={{ display: 'flex', justifyContent: 'right', p: 1 }}>

                                                    <Stack direction={'row'} sx={{ border: '1px solid black', p: 0.5 }}>
                                                        <Typography component={'h4'} variant='p' color={'orange'}>Current Balance: </Typography>
                                                        <Badge color={currentBalance.totalLeaves >= 0 ? 'success' : 'error'} badgeContent={`${currentBalance.totalLeaves}`} invisible={currentBalance === ''} >
                                                            <AccountBalanceWallet />
                                                        </Badge>
                                                    </Stack>

                                                </Box>
                                                <Container sx={{ height: 190, display: 'flex', justifyContent: 'center', flexDirection: 'column', }}>
                                                    <DataTable
                                                        title={''}
                                                        columns={columns}
                                                        data={currentBalance.balanceSheet}
                                                        fixedHeader
                                                        fixedHeaderScrollHeight="150px"
                                                        highlightOnHover
                                                        progressPending={loader}
                                                        pagination
                                                        responsive
                                                        dense
                                                    />
                                                </Container>
                                            </Collapse>
                                        </Container>
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                    <Loader loader={loader} />
                </Box>
            </Box>
        </>
    )
}

export default ManageBalanceLeaves

