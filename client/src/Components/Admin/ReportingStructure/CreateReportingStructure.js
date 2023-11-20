import { Avatar, Box, Button, Card, Container, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import AdminNavBar from '../../Comman/NavBar/AdminNavBar'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';

function CreateReportingStructure() {
    const [selectedRepordingHead, setSelectedRepordingHead] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
    //const [userData, setUserData] = useState([])
    const [filterUserData, setFilterUserData] = useState([])
    const [searchData, setSearchData] = useState({ searchBy: '', field: '' })

    const searchType = { 'employee_id': 'number', email: 'email', name: 'text' }

    const handleSearchUser = (e) => {
        e.preventDefault()
        ////console.log(searchData)
        axios.post('/api/getreportinguser', searchData)
            .then(res => {
                //setUserData(res.data)
                setFilterUserData(res.data)
            })
            .catch(err => toast.warning(err.response.data))
    }
    const handleDelete = (index, section) => {
        if (section === 'reportingHead') {
            ////console.log(index, selectedRepordingHead)

            setSelectedRepordingHead([])
            // ////console.log(selectedRepordingHead)
        }
        else {
            ////console.log(selectedUser)
            const items = Array.from(selectedUser);
            const [reorderedItem] = items.splice(index, 1);

            setSelectedUser(selectedUser.filter(user => user !== reorderedItem))

        }

    }

    const handleClearReportingData = () => {
        setSelectedRepordingHead([])
        setSelectedUser([])
    }

    const handleSubmitReportingData = () => {
        ////console.log(selectedRepordingHead, selectedUser)
        if (selectedRepordingHead.length !== 0 && selectedUser.length !== 0) {
            const reportingHead = selectedRepordingHead[0].employee_id
            const users = selectedUser.map(u => u.employee_id)


            toast.promise(
                axios.post('/api/addreportingstructure', { head: reportingHead, users: users }),
                {
                    pending: {
                        render() {
                            return ('Adding Reporting Structure');
                        },
                    },
                    success: {
                        render(res) {
                            handleClearReportingData()
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
        ////console.log(result)


        const { destination, source } = result
        const data = filterUserData[source.index]
        ////console.log(data)
        //////console.log(userData)

        if (!result.destination) return;
        else {
            if (destination.droppableId === 'reportingHead' && source.droppableId !== "selectedUser") {

                // //console.log(selectedUser)
                if (selectedUser.map(user => JSON.stringify(user)).includes(JSON.stringify([filterUserData[source.index]][0]))) {
                    toast.warning('user already added in Users Section')
                }
                else {
                    setSelectedRepordingHead([data])

                    setFilterUserData(filterUserData.filter(d => d.employee_id !== data.employee_id))
                }

            }
            else if (destination.droppableId === 'reportingHead' && source.droppableId === "selectedUser") {
                const data = selectedUser[source.index]
                setSelectedRepordingHead([data])
                setSelectedUser(selectedUser.filter(d => JSON.parse(d.employee_id !== data.employee_id)))

            }
            else if (destination.droppableId === 'selectedUser' && source.droppableId === 'UserList') {
                // //console.log(Array.from(new Set(selectedUser.map(str=>JSON.stringify(str)))).map(res=>JSON.parse(res)))
                if (selectedRepordingHead.map(user => JSON.stringify(user)).includes(JSON.stringify([filterUserData[source.index]][0]))) {
                    toast.warning('user already added in reporting Head Section')
                }
                else {
                    //console.log(Array.from(new Set([...selectedUser, data].map(str => JSON.stringify(str)))).map(res => JSON.parse(res)))
                    const check_data = selectedUser.filter(d => d.employee_id === data.employee_id).length
                    //console.log('check', check_data, selectedUser.filter(d => d.employee_id === data.employee_id))
                    if (check_data === 0) {
                        setSelectedUser([...selectedUser, data])

                    }

                    //setSelectedUser(Array.from(new Set([...selectedUser, data].map(str => JSON.stringify(str)))).map(res => JSON.parse(res)))//(Array.from(new Set([...selectedUser,userData[source.index]].map(str=>JSON.stringify(str)))).map(res=>JSON.parse(res)))
                    //userData.splice(result.source.index, 1)
                    //console.log('u->selUs', data)
                    setFilterUserData(filterUserData.filter(d => d.employee_id !== data.employee_id))
                }

            }
            else {
                return
            }
        }

    }

    return (
        <>
            <AdminNavBar />
            <Box component='main' sx={{ flexGrow: 1, p: 3, ml: { xs: 8 }, mt: { xs: 20, md: 6, lg: 8 } }}>
                <div style={{ height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid item sm={12} lg={12} md={12}>
                            <Typography variant='h5' component={'h5'} m={1} p={1} textAlign={'center'} >Create Reporing Structure</Typography>
                            <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '30ch', sm: '45ch', md: '100ch', lg: '100ch' }, height: { xs: '100%', sm: '52ch', md: '52ch', lg: '52ch', }, p: 1 }}>
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
                                    <Stack direction={'row'} spacing={2} sx={{ m: 1.5 }}>
                                        <Button variant='outlined' color='success' type='submit' onClick={handleSubmitReportingData} size='small'>Submit</Button>
                                        <Button variant='outlined' color='error' type='clear' onClick={handleClearReportingData} size='small'>Clear</Button>
                                    </Stack>
                                    <Container >
                                        <Box component={'form'} onSubmit={handleSearchUser} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 1 }}>
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
                        </Grid>
                    </Grid>
                </div>
            </Box>
        </>
    )
}

export default CreateReportingStructure