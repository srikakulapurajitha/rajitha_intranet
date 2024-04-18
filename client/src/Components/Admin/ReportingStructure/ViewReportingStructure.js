import { Avatar, Box, Button, Card,  Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl,  IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { Delete, Search, South } from '@mui/icons-material'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import Loader from '../../Comman/Loader'
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'

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

function ViewReportingStructure() {
    
    const [reportingHeadData, setReportingHeadData] = useState([])
    const [filteredReportingHeadData, setFilteredReportingHeadData] = useState([])
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedRepordingHead, setSelectedRepordingHead] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
    //const [userData, setUserData] = useState([])
    const [filterUserData, setFilterUserData] = useState([])
    const [searchData, setSearchData] = useState({ searchBy: '', field: '' })
    const [prevReportingHead, setPrevReportingHead] = useState('')

    const [loader, setLoader] = useState(true)

    useEffect(() => {
        axios.get('/api/getreportingheaddata')
            .then(res => {
                setReportingHeadData(res.data)
                setFilteredReportingHeadData(res.data)
                setLoader(false)
                // console.log(Array.from(new Set(res.data.map(data=>data.reporting_head))).map(newData=>({reporting_head:newData})))
                // setReportingHeadData(Array.from(new Set(res.data.map(data=>data.reporting_head))).map(newData=>({reporting_head:newData})))
            })
            .catch(()=>{
                setLoader(false)
                toast.error('unable to fetch data')
            })
    }, [toggleCleared, editDialogOpen])

    const columns = [
        {
            name: 'Employee ID',
            selector: (row) => row.reporting_head,
            sortable: true,

            center: true

        },
        {
            name: 'Reporting Head',
            selector: row => row.fullname,
            minWidth: '150px',
            center: true

        },
        {
            name: 'Action',
            cell: (row) => (
                <Stack display={'flex'} spacing={1} direction={'row'} height={25}>
                    <Button variant='outlined' onClick={() => handleEditButton(row)} size='small'  >EDIT</Button>
                    <Divider orientation="vertical" flexItem />
                    <Button color='success' onClick={() => handleViewButton(row)} variant='outlined' size='small'>View</Button>
                </Stack>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
            minWidth: '200px',
        }
    ];

     //reporting structure view
//-----------------------------------------------------------------------------------VIEW--------------------------------------------------------------------------

    const handleViewButton = (row) => {
        
        //console.log(row)
        //setViewCompData(row)
        setSelectedRepordingHead([row])
        

        axios.post('/api/editreportingstructuredata', { 'head': row.reporting_head })
            .then(res => {
                setSelectedUser(res.data)
                setLoader(false)
                setViewDrawerOpen(true)
            })
            .catch(()=>{
                setLoader(false)
                toast.error('unable to procced your request!')
            })

    }

   

    const ReportingStructureView = useMemo(() => {
        const handleViewButtonDrawerToggleClosing = () => {
            setViewDrawerOpen(false);
            setSelectedRepordingHead([])
            setSelectedUser([])
        };
        


        return (
            <Drawer
                anchor={'right'}
                open={viewDrawerOpen}
                onClose={handleViewButtonDrawerToggleClosing}
                variant="temporary"
                sx={{
                    width: {lg:850,xs:350},
                    '& .MuiDrawer-paper': {
                        width: {lg:850,xs:350},
                        marginTop: 6
                    }
                }}
            >
                <div style={{ height: '90vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '90%', height: '55ch' }}>

                        <Typography variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Reporting Structure</Typography>

                        <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '90%', height: '400px', }}>
                            <Container sx={{ display: 'flex', justifyContent: 'center', }}>
                                <FormControl>
                                    <Typography marginBottom={0.5} component={'h4'} variant='p' textAlign={'center'}>Reporting Head</Typography>
                                    <Card>
                                    <List>
                                        {selectedRepordingHead.map(({ profile_pic, fullname, employee_id, designation }, index) => {
                                            return (
                                                <Box key={index}>

                                                <ListItem alignItems="flex-start"

                                                >
                                                    <ListItemAvatar>
                                                        <Avatar alt={fullname} src={profile_pic} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={`${fullname} (bcg/${employee_id})`}
                                                        secondary={designation}
                                                    />

                                                </ListItem>
                                                
                                                </Box>

                                            )
                                        })}
                                    </List>
                                        

                                        
                                    </Card>



                                </FormControl>


                            </Container>
                            <South fontSize='large' />
                            <Typography marginBottom={0.5} component={'h4'} variant='p'>Reporting Users</Typography>
                            <Container>
                            
                                <Card sx={{overflow: 'auto',maxHeight:200}} >
                                    <List dense>
                                        {selectedUser.map(({ profile_pic, fullname, employee_id, designation }, index) => {
                                            return (
                                                <Box key={index}>

                                                <ListItem alignItems="flex-start"

                                                >
                                                    <ListItemAvatar>
                                                        <Avatar alt={fullname} src={profile_pic} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={`${fullname} (bcg/${employee_id})`}
                                                        secondary={designation}
                                                    />

                                                </ListItem>
                                                <Divider />
                                                </Box>

                                            )
                                        })}
                                    </List>
                                </Card>

                            </Container>


                        </Container>


                    </Paper>
                </div>
            </Drawer>
        )
    }, [viewDrawerOpen,selectedRepordingHead,selectedUser])

//--------------------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------EDIT-----------------------------------------------------------------------

    //edit button
    const handleEditButton = (row) => {
        //console.log(row)
        
        setSelectedRepordingHead([row])
        setPrevReportingHead(row.employee_id)

        axios.post('/api/editreportingstructuredata', { 'head': row.reporting_head })
            .then(res => {
                //console.log(res.data)
                setSelectedUser(res.data)
                setLoader(false)
                setEditDialogOpen(true)
            })
            .catch((err)=>{
                setLoader(false)
                toast.error(err.response.data)
            })
        //setEditCompData(row)

    }

    //company edit view
    const ReportingStructureEdit = useMemo(() => {



        const searchType = { 'employee_id': 'number', email: 'email', name: 'text' }

        const handleSearchUser = (e) => {
            e.preventDefault()
            //console.log(searchData)
            axios.post('/api/getreportinguser', searchData)
                .then(res => {
                    //setUserData(res.data)
                    
                    setFilterUserData(res.data)
                })
                .catch(err => toast.warning(err.response.data))
        }
        const handleDelete = (index, section) => {
            if (section === 'reportingHead') {
                //console.log(index, selectedRepordingHead)

                setSelectedRepordingHead([])
                // console.log(selectedRepordingHead)
            }
            else {
                //console.log(selectedUser)
                const items = Array.from(selectedUser);
                const [reorderedItem] = items.splice(index, 1);

                setSelectedUser(selectedUser.filter(user => user !== reorderedItem))

            }

        }


        const handleEditDialogClose = () => {
            setEditDialogOpen(false)
            setFilterUserData([])
            setSelectedRepordingHead([])
            setSelectedUser([])
            setSearchData({ searchBy: '', field: '' })
        }
        const handleUpdateReportingData = () => {
            //console.log(selectedRepordingHead, selectedUser)
            if (selectedRepordingHead.length !== 0 && selectedUser.length !== 0) {
                const reportingHead = selectedRepordingHead[0].employee_id
                const users = selectedUser.map(u => u.employee_id)


                toast.promise(
                    axios.post('/api/updatereportingstructure', { prevHead: prevReportingHead, head: reportingHead, users: users }),
                    {
                        pending: {
                            render() {
                                return ('Updating Reporting Structure');
                            },
                        },
                        success: {
                            render(res) {
                                handleEditDialogClose()
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
            else {
                toast.warning('please add data to both field')
            }

        }

        function handleOnDragEnd(result) {
            //console.log(result)


            const { destination, source } = result
            const data = filterUserData[source.index]
            //console.log(data)
            //console.log(userData)

            if (!result.destination) return;
            else {
                if (destination.droppableId === 'reportingHead' && source.droppableId !== "selectedUser") {

                     //console.log(selectedUser,source.index)
                     //console.log(filterUserData,filterUserData[source.index][0])
                     //console.log('res',data.employee_id,selectedUser.map(user => user.employee_id),selectedUser.map(user => user.employee_id).includes(data.employee_id))
                    if (selectedUser.map(user => user.employee_id).includes(data.employee_id)) {
                        toast.warning('user already added in Users Section')
                    }
                    else {
                        setSelectedRepordingHead([data])

                        setFilterUserData(filterUserData.filter(d => d.employee_id!==data.employee_id))
                    }

                }
                else if (destination.droppableId === 'reportingHead' && source.droppableId === "selectedUser") {
                    const data = selectedUser[source.index]
                    setSelectedRepordingHead([data])
                    setSelectedUser(selectedUser.filter(d => JSON.parse(d.employee_id !== data.employee_id)))

                }
                else if (destination.droppableId === 'selectedUser' && source.droppableId === 'UserList') {
                    // console.log(Array.from(new Set(selectedUser.map(str=>JSON.stringify(str)))).map(res=>JSON.parse(res)))
                    if (selectedRepordingHead.map(user => user.employee_id).includes(data.employee_id)) {
                        toast.warning('user already added in reporting Head Section')
                    }
                    else {
                        //console.log(Array.from(new Set([...selectedUser, data].map(str => JSON.stringify(str)))).map(res => JSON.parse(res)))
                        const check_data = selectedUser.filter(d=>d.employee_id===data.employee_id).length
                        //console.log('check',check_data,selectedUser.filter(d=>d.employee_id===data.employee_id))
                        if(check_data===0){
                            setSelectedUser([...selectedUser,data])

                        }
                        
                        //setSelectedUser(Array.from(new Set([...selectedUser, data].map(str => JSON.stringify(str)))).map(res => JSON.parse(res)))//(Array.from(new Set([...selectedUser,userData[source.index]].map(str=>JSON.stringify(str)))).map(res=>JSON.parse(res)))
                        //userData.splice(result.source.index, 1)
                        //console.log('u->selUs', data)
                        setFilterUserData(filterUserData.filter(d => d.employee_id!==data.employee_id))
                    }

                }
                else {
                    return
                }
            }

        }

        return (
            <>
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth={'800'}



                >
                    <DialogTitle>Edit Reporting Structure</DialogTitle>
                    <DialogContent dividers={true}>
                        <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '30ch', sm: '45ch', md: '100ch', lg: '100ch' }, height: { xs: '100%', sm: '50ch', md: '50ch', lg: '50ch', }, p: 1 }}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Container sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row', lg: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: { xs: '1px solid black', sm: 'none', md: 'none', lg: 'none' }, borderRight: { xs: 'none', sm: '1px solid black', md: '1px solid black', lg: '1px solid black' } }}>
                                        <InputLabel sx={{ margin: 1 }}>Add Reporting Head</InputLabel>
                                        <Droppable droppableId='reportingHead'>
                                            {
                                                (provided) => (
                                                    <Box
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        sx={{ width: { xs: '25ch', sm: '40ch', md: '40ch', lg: "40ch" }, height: 150, overflow: 'auto', border: '1px solid black' }}>
                                                        <List>
                                                            {selectedRepordingHead.map(({ profile_pic, fullname, employee_id, designation }, index) => {
                                                                return (
                                                                    <ListItem key={(index)} alignItems="flex-start"
                                                                        secondaryAction={
                                                                            <IconButton onClick={() => handleDelete(index, 'reportingHead')} edge="end" aria-label="comments">
                                                                                <Delete color='error' />
                                                                            </IconButton>
                                                                        }
                                                                    >
                                                                        <ListItemAvatar>
                                                                            <Avatar alt={fullname} src={profile_pic} />
                                                                        </ListItemAvatar>
                                                                        <ListItemText
                                                                            primary={`${fullname} (bcg/${employee_id})`}
                                                                            secondary={designation}
                                                                        />
                                                                    </ListItem>
                                                                );
                                                            })}
                                                        </List>
                                                        {provided.placeholder}
                                                    </Box>
                                                )
                                            }
                                        </Droppable>
                                    </Container>

                                    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                                        <InputLabel sx={{ margin: 1 }}>Add Users</InputLabel>
                                        <Droppable droppableId='selectedUser'>
                                            {
                                                (provided) => (

                                                    <Box
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}

                                                        sx={{ width: { xs: '25ch', sm: '40ch', md: '40ch', lg: "39ch" }, height: 150, overflowX: 'hidden', overflowY: 'scroll', border: '1px solid black' }}>
                                                        <List>
                                                            {selectedUser.map(({ profile_pic, fullname, employee_id, designation }, index) => {
                                                                return (
                                                                    <Draggable key={employee_id} draggableId={`selectedUser${employee_id}`} index={index} >
                                                                        {
                                                                            (provided) => {
                                                                                return (
                                                                                    <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} alignItems="flex-start"
                                                                                        secondaryAction={
                                                                                            <IconButton onClick={() => handleDelete(index, 'selectedUser')} edge="end" aria-label="comments">
                                                                                                <Delete color='error' />
                                                                                            </IconButton>
                                                                                        }
                                                                                    >
                                                                                        <ListItemAvatar>
                                                                                            <Avatar alt={fullname} src={profile_pic} />
                                                                                        </ListItemAvatar>
                                                                                        <ListItemText
                                                                                            primary={`${fullname} (bcg/${employee_id})`}
                                                                                            secondary={designation}
                                                                                        />

                                                                                    </ListItem>
                                                                                )
                                                                            }
                                                                        }
                                                                    </Draggable>
                                                                )
                                                            })}
                                                        </List>
                                                        {provided.placeholder}
                                                    </Box>
                                                )
                                            }
                                        </Droppable>
                                    </Container>
                                </Container>

                                <Container >
                                    <Box component={'form'} onSubmit={handleSearchUser} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 1, marginTop: 1 }}>
                                        <Stack direction={{ xs: 'column', md: 'row', lg: 'row' }} spacing={2}>
                                            <FormControl sx={{ width: 150 }}>
                                                <InputLabel required size='small'>Serach By</InputLabel>
                                                <Select
                                                    required
                                                    size='small'
                                                    label='Serach By'
                                                    value={searchData.searchBy}
                                                    onChange={e => {

                                                        setSearchData({ field: '', searchBy: e.target.value })
                                                    }}
                                                >
                                                    {
                                                        Object.keys(searchType).map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)
                                                    }
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                required
                                                size='small'
                                                value={searchData.field}
                                                type={searchType[searchData.searchBy]}
                                                onChange={e => setSearchData({ ...searchData, field: e.target.value })}
                                            ></TextField>
                                            <Button variant='contained' color='info' type='submit' size='small'>Search</Button>
                                        </Stack>
                                    </Box>
                                    <Typography component={'h5'} textAlign={'center'} m={1} variant='p'>Drag User into the box</Typography>

                                    <Card sx={{ maxWidth: '100%', height: 120, bgcolor: 'background.paper', overflow: 'auto' }}>
                                        <Droppable droppableId="UserList">
                                            {(provided) => (
                                                <List dense  {...provided.droppableProps} ref={provided.innerRef}>
                                                    {filterUserData.map(({ profile_pic, fullname, employee_id, designation }, index) => {
                                                        return (
                                                            <Draggable key={employee_id} draggableId={`UserList${employee_id}`} index={index}>
                                                                {(provided) => (
                                                                    <ListItem alignItems="flex-start" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}  >
                                                                        <ListItemAvatar>
                                                                            <Avatar alt={fullname} src={profile_pic} />
                                                                        </ListItemAvatar>
                                                                        <ListItemText
                                                                            primary={`${fullname} (bcg/${employee_id})`}
                                                                            secondary={designation}
                                                                        />
                                                                    </ListItem>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </List>
                                            )}
                                        </Droppable>
                                    </Card>
                                </Container>
                            </DragDropContext>

                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button color='error' onClick={handleEditDialogClose}>Cancel</Button>
                        <Button color='success' type='submit' form='editcompany' onClick={() => handleUpdateReportingData()} >Update</Button>
                    </DialogActions>

                </Dialog>
            </>
        )
    }, [editDialogOpen, searchData, filterUserData, selectedRepordingHead, selectedUser, prevReportingHead])
//--------------------------------------------------------------------------------------------------------------------------------------------------

    const subHeaderViewannouncementMemo = useMemo(() => {
        const handleSearch = (e) => {
            const filteredData = reportingHeadData.filter((d) => (d.fullname).toLowerCase().includes(e.target.value.toLowerCase()));
            setFilteredReportingHeadData(filteredData);
        };

        return (
            <Box >
                <TextField
                    variant='outlined'
                    size='small'
                    placeholder='search reporting head'
                    onInput={handleSearch}
                    InputProps={{ endAdornment: <Search /> }}
                />
            </Box>
        );
    }, [reportingHeadData]);

    // Row selection
    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    // Handling selected row operation
    const contextActions = useMemo(() => {
        const handleDelete = async () => {

            toast.promise(
                axios.post(`/api/deletereportingstructure`, { head: selectedRows.map((rowdata) => rowdata.employee_id) }),
                {
                    pending: {
                        render() {
                            return ('Deleting reporting structure');
                        },
                    },
                    success: {
                        render(res) {
                            setToggleCleared(!toggleCleared);
                            return (res.data.data)
                        },
                    },
                    error: {
                        render(err) {
                            return (err.data.response.data)
                        },
                    },
                }
            );
        }

        return (
            <Button size='medium' key='delete' variant='contained' color='error' onClick={() => handleDelete(selectedRows)} startIcon={<Delete />}>
                Delete
            </Button>
        );
    }, [selectedRows, toggleCleared]);


    return (
        <>



            <Box sx={{ display: 'flex' }}>
               <AccessNavBar />
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
                    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant='h5' component={'h5'} m={2} textAlign={'center'} >View Reporting Structure</Typography>
                        <div style={{ height: '400px', width: '95%' }}>
                            <Card>
                                <DataTable

                                    title=' '
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight='250px'
                                    columns={columns}
                                    data={filteredReportingHeadData}
                                    selectableRows
                                    contextActions={contextActions}
                                    onSelectedRowsChange={handleRowSelected}
                                    clearSelectedRows={toggleCleared}
                                    pagination
                                    dense
                                    subHeader
                                    sele
                                    subHeaderComponent={subHeaderViewannouncementMemo}
                                    customStyles={customStyles}
                                />
                            </Card>
                        </div>
                    </div>
                </Box>
                {ReportingStructureView}
                {ReportingStructureEdit}




            </Box>
            <Loader loader={loader} />    
        </>
    )
}

export default ViewReportingStructure