import React, { useEffect, useState, useMemo } from 'react';
import {
    Backdrop, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemText,
    MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography
} from '@mui/material';
import DataTable from 'react-data-table-component';
import { defaultThemes } from 'react-data-table-component';
import AdminNavBar from '../../Comman/NavBar/AdminNavBar';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


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
            name: 'Title',
            selector: (row) => row.title,
            center: true,
        },
        {
            name: 'Description',
            selector: (row) => row.description,
            center: true,
        },
        {
            name: 'Date',
            selector: (row) => row.announcement_date,
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

    // Taking announcement data from API
    useEffect(() => {
        axios.get('/api/viewannouncement/')
            .then((res) => {
                const data = res.data.map(d => ({ ...d, announcement_date: new Date(d.announcement_date).toLocaleString('en-CA').slice(0, 10) }))
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

    // announcement details view
    const announcementDetailView = useMemo(() => {
        console.log(viewAnnouncement)
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
                    <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '35ch', md: '35ch' }, height: { xs: '55ch', sm: '55ch', md: '55ch' } }}>

                        <Typography variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Announcement Details</Typography>

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
                                                Date:
                                            </Typography>
                                            {viewAnnouncement.announcement_date}
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

                        </List>
                    </Paper>
                </div>

            </Drawer>
        );
    }, [viewDrawerOpen, viewAnnouncement]);

    const handleEditButton = (row) => {
        //console.log(row);
        setEditDialogOpen(true);
        setEditAnnouncement(row);
    };

    // Announcement edit view
    const AnnouncementEditView = useMemo(() => {
        const handleEditDialogClose = () => {
            setEditDialogOpen(false);
            setEditAnnouncement({})
        };

        const handleEdit = async (e) => {
            e.preventDefault();
            if (!editAnnouncement.announcement_date) {
                setDateError(true)
            }
            else {
                setDateError(false)
                toast.promise(
                    axios.put(`/api/updateannouncement`, editAnnouncement),
                    {
                        pending: {
                            render() {
                                return('Updating announcements');
                            },
                        },
                        success: {
                            render(res) {
                                setEditDialogOpen(false);
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
                                width: { sm: '50ch', md: '50ch' },
                                height: { sm: '30ch', md: '45ch' },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: { sm: '45ch', md: '40ch' },
                                    height: { sm: '25ch', md: '45ch' },
                                    p: 1,
                                }}
                            >
                                <form id='editannouncement' onSubmit={handleEdit}>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant='outlined'>
                                        <InputLabel required >
                                            Announcement
                                        </InputLabel>
                                        <Select
                                            label="Select Company"
                                            name="company_name"
                                            value={editAnnouncement.company_name}
                                            required
                                            onChange={e => {
                                                const compId = companyNames.filter(c => c.company_name === e.target.value)
                                                setEditAnnouncement({ ...editAnnouncement, company_name: e.target.value, companyId: compId[0].id })
                                            }}
                                        >

                                            {companyNames.map((name, index) => <MenuItem key={index} value={name.company_name}>{name.company_name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant='outlined'>
                                        <InputLabel required htmlFor='outlined-adornment-editannouncementtitle'>
                                            Title
                                        </InputLabel>
                                        <OutlinedInput
                                            name='AnnouncementTitle'
                                            value={editAnnouncement.title}
                                            onInput={(e) => setEditAnnouncement({ ...editAnnouncement, title: e.target.value })}
                                            required={true}
                                            id='outlined-adornment-editannouncementtitle'
                                            type={'title'}
                                            label='Title'
                                            placeholder='Enter announcement title'
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant='outlined'>
                                        <InputLabel required htmlFor='outlined-adornment-editannouncementdescription'>
                                            Announcement Description
                                        </InputLabel>
                                        <OutlinedInput
                                            name='announcement description'
                                            value={editAnnouncement.description}
                                            onInput={(e) => setEditAnnouncement({ ...editAnnouncement, description: e.target.value })}
                                            required={true}
                                            multiline
                                            id='outlined-adornment-editannouncementdescription'
                                            type={'text'}
                                            label='Announcement Description'
                                            minRows={4}
                                            maxRows={4}
                                            placeholder='Enter announcement description'
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                                            <DatePicker
                                                value={editAnnouncement.announcement_date ? dayjs(editAnnouncement.announcement_date) : null}
                                                onChange={e => setEditAnnouncement({ ...editAnnouncement, announcement_date: e.$d.toLocaleDateString('en-CA') })}
                                                slotProps={{ textField: { error: dateError, required: true } }}
                                                label="Announcement Date"
                                                format='DD/MM/YYYY'
                                                startIcon={<EventIcon />} // Calendar icon
                                            />
                                        </LocalizationProvider>

                                    </FormControl>

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
    }, [editDialogOpen, companyNames, dateError, editAnnouncement]);

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
            <AdminNavBar />
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

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
                <img src='gif2.gif' alt='loader' style={{ mixBlendMode: 'lighten' }} />
            </Backdrop>
        </>
    );
};

export default ViewAnnouncements;





