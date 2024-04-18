import React, { useEffect, useState, useMemo } from 'react';
import {
    Autocomplete,
    Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl, FormControlLabel, FormLabel, InputLabel, List, ListItem, ListItemText,
    MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Stack, TextField, Typography
} from '@mui/material';
import DataTable from 'react-data-table-component';
import { defaultThemes } from 'react-data-table-component';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckBox, CheckBoxOutlineBlank, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loader from '../../Comman/Loader';
import AccessNavBar from '../../Comman/NavBar/AccessNavBar';


const customStyles = {
    header: {
        style: {
            minHeight: '56px',
        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: defaultThemes.default.divider.default,
        },
    },
    headCells: {
        style: {
            fontSize: '14px',
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
    cells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
};

const ViewAnnouncements = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [data, setData] = useState([]);
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [filteredAnnouncement, setFilteredAnnouncement] = useState(data);
    const [viewAnnouncement, setViewAnnouncement] = useState({});
    const [editAnnouncement, setEditAnnouncement] = useState({});
    const [loader, setLoader] = useState(true);
    const [dateError, setDateError] = useState(false)
    const [companyNames, setCompanyNames] = useState([])
    const [inputValue, setInputValue] = useState('')

    const [prevData, setPrevData] = useState(editAnnouncement)

    useEffect(() => {
        axios.get('/api/companynames')
            .then(res => {
                //console.log(res.data)
                setCompanyNames(res.data)
            })
            .catch(() => toast.error('unable to get company names!'))
    }, [])

    


    // Column names creation
    const columns = [
        {
            name: 'Company Name',
            selector: (row) => row.company_name,
            sortable: true,
            center: true,
        },
        {
            name: 'Department',
            selector: (row) => row.department,
            
            center: true,
        },
        {
            name: 'Title',
            selector: (row) => row.title,
            center: true,
        },
        
        {
            name: 'From Date',
            selector: (row) => row.from_date,
            center: true,
        },
        {
            name: 'To Date',
            selector: (row) => row.to_date,
            center: true,
        },
        
        {
            name: 'Action',
            cell: (row) => (
                <Stack display={'flex'} spacing={1} direction={'row'} height={25}>
                    <Button variant='outlined' size='small' onClick={() => handleEditButton(row)}>EDIT</Button>
                    <Divider orientation="vertical" flexItem />
                    <Button color='success' variant='outlined' size='small' onClick={() => handleViewButton(row)}>View</Button>
                </Stack>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
            minWidth: '200px',
        },
    ];

    // Taking Data from API
    useEffect(() => {
        axios.get('/api/viewannouncement/')
            .then((res) => {
                const data = res.data.map(d => ({ ...d, from_date: new Date(d.from_date).toLocaleString('en-CA').slice(0, 10), to_date: new Date(d.to_date).toLocaleString('en-CA').slice(0, 10)  }))
                setData(data); // Set the data state with the fetched data
                setFilteredAnnouncement(data); // Initialize filteredAnnouncement with the fetched data
                setLoader(false);
            })
            .catch((err) => {
                //console.error(err);
                setLoader(false);
            });
    }, [toggleCleared, editDialogOpen]);

    // Handling view button
    const handleViewButton = (row) => {
        setViewDrawerOpen(true);
        //setEditAnnouncement(row);
        setViewAnnouncement(row);
    };

    // Details view
    const announcementDetailView = useMemo(() => {
        //console.log(viewAnnouncement)
        const handleViewButtonDrawerToggleClosing = () => {
            setViewDrawerOpen(!viewDrawerOpen);
            setViewAnnouncement({});
        };

        return (
            <Drawer
                anchor={'right'}
                open={viewDrawerOpen}
                onClose={handleViewButtonDrawerToggleClosing}
                variant="temporary"
                sx={{
                    width: 350,
                    '& .MuiDrawer-paper': {
                        width: 350,
                        marginTop: 6,
                    },
                }}
            >
                <div style={{ height: '90vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: { xs: '35ch', md: '35ch' }, minHeight: { xs: '55ch', sm: '55ch', md: '55ch' } }}>

                        <Typography variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Details</Typography>

                        <List sx={{ width: '100%', display: "flex", margin: 0, flexDirection: 'column' }}>

                            <ListItem alignItems="flex-start" >

                                <ListItemText

                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                mr={0.5}
                                            >
                                                Company Name:
                                            </Typography>
                                            {viewAnnouncement.company_name}
                                        </>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start" >

                                <ListItemText

                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                mr={0.5}
                                            >
                                                Department:
                                            </Typography>
                                            {viewAnnouncement.department}
                                        </>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                mr={0.5}
                                            >
                                                Title:
                                            </Typography>
                                            {viewAnnouncement.title}
                                        </>
                                    }
                                />
                            </ListItem>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                mr={0.5}
                                            >
                                                From Date:
                                            </Typography>
                                            {viewAnnouncement.from_date}
                                        </>
                                    }
                                />
                            </ListItem>

                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                mr={0.5}
                                            >
                                                To Date:
                                            </Typography>
                                            {viewAnnouncement.to_date}
                                        </>
                                    }
                                />
                            </ListItem>

                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                mr={0.5}
                                            >
                                                Description:
                                            </Typography>
                                            {viewAnnouncement.description}
                                        </>
                                    }
                                />
                            </ListItem>

                            <ListItem alignItems="flex-start" >

                                <ListItemText

                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                mr={0.5}
                                            >
                                                Notified:
                                            </Typography>
                                            {viewAnnouncement.notify}
                                        </>
                                    }
                                />
                            </ListItem>

                        </List>
                    </Paper>
                </div>

            </Drawer>
        );
    }, [viewDrawerOpen, viewAnnouncement]);
    
    const options = [{ name:'Management', value:'management' },
    {  name:'Software', value:'software' },
    { name: 'AI Labelling', value: 'ai labelling' },
    { name:'Accounts', value:'accounts'},
    { name:'HR', value:'hr' },
    { name:'IT', value:'it' },
    ]
    const handleEditButton = (row) => {
        //console.log(row);
        setEditDialogOpen(true);
        
        setPrevData({...row,department:options.filter(dep=>row.department.split(',').includes(dep.value))})
        setEditAnnouncement({...row,department:options.filter(dep=>row.department.split(',').includes(dep.value))});
    };

    // Announcement edit view
    const AnnouncementEditView = useMemo(() => {
        const options = [{ name:'Management', value:'management' },
    {  name:'Software', value:'software' },
    { name: 'AI Labelling', value: 'ai labelling' },
    { name:'Accounts', value:'accounts'},
    { name:'HR', value:'hr' },
    { name:'IT', value:'it' },
    ]
        const handleEditDialogClose = () => {
            setEditDialogOpen(false);
            setEditAnnouncement({
                id:'',
                company_name:'',
                department:[],
                title:'',
                description:'',
                from_date:null,
                to_date:'',
                notify:'no',
                companyId:''
            })
            setPrevData({
                id:'',
                company_name:'',
                department:[],
                title:'',
                description:'',
                from_date:null,
                to_date:'',
                notify:'no',
                companyId:''
            })
        };

        const handleEdit = async (e) => {
            e.preventDefault();
            //console.log({...editAnnouncement,department:editAnnouncement.department.map(dep=>dep.value)})
            if (!editAnnouncement.from_date && !editAnnouncement.to_date) {
                setDateError(true)
            }
            else {
                if(JSON.stringify(editAnnouncement)!==JSON.stringify(prevData)){
                    setDateError(false)
                    toast.promise(
                        axios.put(`/api/updateannouncement`, {...editAnnouncement,department:editAnnouncement.department.map(dep=>dep.value)}),
                        {
                            pending: {
                                render() {
                                    return('Updating announcements');
                                },
                            },
                            success: {
                                render(res) {
                                    handleEditDialogClose()
                                    setPrevData(editAnnouncement)
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
                else{
                    handleEditDialogClose()

                }

                }
                

        };

        return (
            <>
                <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                    <DialogTitle>Edit Announcement</DialogTitle>
                    <DialogContent dividers={true}>
                        <Paper
                            elevation={1}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                               
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    
                                    p: 1,
                                }}
                            >
                                <form id='editannouncement' onSubmit={handleEdit}>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant='outlined'>
                                        <InputLabel size='small' required >
                                        Select Company
                                        </InputLabel>
                                        <Select
                                            label="Select Company"
                                            name="company_name"
                                            value={editAnnouncement.company_name?editAnnouncement.company_name:''}
                                            required
                                            size='small'
                                            onChange={e => {
                                                const compId = companyNames.filter(c => c.company_name === e.target.value)
                                                setEditAnnouncement({ ...editAnnouncement, company_name: e.target.value, companyId: compId[0].id })
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
                                                value={editAnnouncement.department}
                                                isOptionEqualToValue={(option,value) => option.value===value.value}
                                                onChange={(_, newValue) => {
                                                    //console.log(newValue);
                                                    setEditAnnouncement({...editAnnouncement,department:newValue})
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
                                                    <TextField required={editAnnouncement.department.length===0}  {...params} size='small' label="Department"  />
                                                )}
                                            />
                                        </FormControl>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant='outlined'>
                                        <InputLabel size='small' required >
                                            Title
                                        </InputLabel>
                                        <OutlinedInput
                                            name='AnnouncementTitle'
                                            value={editAnnouncement.title}
                                            onInput={(e) => setEditAnnouncement({ ...editAnnouncement, title: e.target.value })}
                                            required={true}
                                            
                                            type={'title'}
                                            label='Title'
                                            placeholder='Enter announcement title'
                                            size='small'
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant='outlined'>
                                        <InputLabel size='small' required >
                                            Description
                                        </InputLabel>
                                        <OutlinedInput
                                            name='Description'
                                            value={editAnnouncement.description}
                                            onInput={(e) => setEditAnnouncement({ ...editAnnouncement, description: e.target.value })}
                                            required={true}
                                            multiline
                                            
                                            type={'text'}
                                            label='Description'
                                            minRows={4}
                                            maxRows={4}
                                            placeholder='Enter Description'
                                            size='small'
                                        />
                                    </FormControl>
                                    

                                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack direction={{xs:'column',sm:'column',md:'row',lg:'row'}} spacing={2}>
                                                <DatePicker
                                                
                                                    value={editAnnouncement.from_date ? dayjs(editAnnouncement.from_date) : null}
                                                    onChange={e =>e.$d? setEditAnnouncement({ ...editAnnouncement, from_date: e.$d.toLocaleDateString('en-CA') }):null}
                                                    slotProps={{ textField: { error: dateError, required: true,size:'small' } }}
                                                    label="From Date"
                                                    format='DD/MM/YYYY'
                                                    maxDate={editAnnouncement.to_date ? dayjs(editAnnouncement.to_date) : null}
                                                    startIcon={<EventIcon />} // Calendar icon
                                                />
                                                 <DatePicker
                                                    value={editAnnouncement.from_date ? dayjs(editAnnouncement.to_date) : null}
                                                    onChange={e => e.$d?setEditAnnouncement({ ...editAnnouncement, to_date: e.$d.toLocaleDateString('en-CA') }):null}
                                                    slotProps={{ textField: { error: dateError, required: true ,size:'small'} }}
                                                    label="To Date"
                                                    format='DD/MM/YYYY'
                                                    minDate={editAnnouncement.from_date ? dayjs(editAnnouncement.from_date) : null}
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
                                                        value={editAnnouncement.notify}
                                                        name='notify'
                                                        onChange={e=>setEditAnnouncement({...editAnnouncement,notify:e.target.value})}


                                                    >
                                                        <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                                                    </RadioGroup>
                                                </FormControl>

                                            </Stack>

                                </form>
                            </Box>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button color='error' onClick={handleEditDialogClose}>
                            Cancel
                        </Button>
                        <Button color='success' type='submit' form='editannouncement'>
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }, [editDialogOpen, companyNames, dateError, editAnnouncement,prevData,inputValue]);

    // Table search bar
    const subHeaderViewannouncementMemo = useMemo(() => {
        const handleSearch = (e) => {
            const filteredData = data.filter((d) => (d.title).toLowerCase().includes(e.target.value.toLowerCase()));
            setFilteredAnnouncement(filteredData);
        };

        return (
            <Box>
                <TextField
                    variant='outlined'
                    size='small'
                    placeholder='Search announcement'
                    onInput={handleSearch}
                    InputProps={{ endAdornment: <SearchIcon /> }}
                />
            </Box>
        );
    }, [data]);

    // Row selection
    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    // Handling selected row operation
    const contextActions = useMemo(() => {
        const handleDelete = async () => {

            toast.promise(
                axios.post(`/api/deleteannouncement`, { id: selectedRows.map((details) => details.id) }),
                {
                    pending: {
                        render() {
                            return('Deleting announcement');
                        },
                    },
                    success: {
                        render(res) {
                            setToggleCleared(!toggleCleared);
                            return(res.data.data)
                        },
                    },
                    error: {
                        render(err) {
                            return(err.data.response.data)
                        },
                    },
                }
            );
        }

        return (
            <Button size='medium' key='delete' variant='contained' color='error' onClick={handleDelete} startIcon={<Delete />}>
                Delete
            </Button>
        );
    }, [selectedRows, toggleCleared]);

    return (
        <>
           <AccessNavBar />
            <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 8 } }}>
                <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant='h5' component={'h5'} m={2} textAlign={'center'}>
                        View announcement
                    </Typography>
                    <div style={{ height: '400px', width: '95%' }}>
                        <Card>
                            <DataTable
                                title=' '
                                fixedHeader={true}
                                fixedHeaderScrollHeight='250px'
                                columns={columns}
                                data={filteredAnnouncement}
                                selectableRows
                                contextActions={contextActions}
                                onSelectedRowsChange={handleRowSelected}
                                clearSelectedRows={toggleCleared}
                                pagination
                                dense
                                subHeader
                                subHeaderComponent={subHeaderViewannouncementMemo}
                                customStyles={customStyles}
                            />
                        </Card>
                    </div>
                </div>
            </Box>
            {announcementDetailView}
            {AnnouncementEditView}

            <Loader loader={loader} /> 
        </>
    );
};

export default ViewAnnouncements;





