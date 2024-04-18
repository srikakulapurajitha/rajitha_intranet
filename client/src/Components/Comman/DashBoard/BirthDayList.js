import { Avatar, Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, MobileStepper, Paper, Stack, TextField, Typography } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import MessageIcon from '@mui/icons-material/Message';
import React, { useContext, useEffect, useMemo, useState } from 'react';
//import { useTheme } from 'styled-components';
import axios from 'axios'
import UserContext from '../../context/UserContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';

const BirthDayList = (props) => {
    const [activeStep, setActiveStep] = useState(new Date().getMonth());

    const [filterBirthdayList, setFilterBirthdayList] = useState([])
    const [selectedUser, setSelectedUser] = useState({})
    const maxSteps = 12;
    const [open, setOpen] = useState(false);
    const [birthdayMsg, setBirthdayMsg] = useState('')
    const [subject, setSubject] = useState('')
    const { birthdayData } = props

    const { userDetails } = useContext(UserContext)

    const handleClickOpen = (user) => {
        //console.log(activeStep)
        setSelectedUser(user)
        setOpen(true);
    };

    const months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    }
    //console.log(activeStep)


    useEffect(() => {
        // console.log('bir',birthdayData)
        const filteredList = birthdayData.filter((data) => new Date(new Date(data.date_of_birth).toLocaleString('en-CA').slice(0, 10)).getMonth() === activeStep)
        // console.log(filteredList)
        const birthdayList = filteredList.map(d => ({ profile: d.profile_pic, name: `${d.first_name} ${d.last_name}`, email: d.email, dob: `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(new Date(d.date_of_birth).toLocaleString('en-CA').slice(0, 10)))} ${new Date(new Date(d.date_of_birth).toLocaleString('en-CA').slice(0, 10)).getDate()}` }))
        // console.log(birthdayList)
        setFilterBirthdayList(birthdayList)
    }, [birthdayData, activeStep])


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const sendBirthDayWishes = useMemo(() => {
        const handleClose = () => {
            setOpen(false);
            setSelectedUser({})
            setBirthdayMsg('')
            setSubject('')
        };
        const handleSendBirthdayGreeting = (e) => {
            // console.log(birthdayMsg)
            e.preventDefault()
            if (birthdayMsg !== '') {
                toast.promise(axios.post('/api/sendbirthdaywishes', { to: selectedUser.email, name: `${userDetails.first_name} ${userDetails.last_name}`, from: userDetails.email, subject: subject, msg: birthdayMsg }), {
                    pending: {
                        render() {
                            return ('sending birthday wishes')
                        }
                    },
                    success: {
                        render(res) {
                            handleClose()
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

        return (
            <Dialog
                open={open}
                onClose={handleClose}

            >
                <DialogTitle >
                    {"Send Birthday Wishes 🥳"}
                </DialogTitle>

                <DialogContent sx={{ minWidth: { xs: '45ch', lg: '50ch' } }}>

                    <form id='sendBirthdayMsg' onSubmit={handleSendBirthdayGreeting}>
                        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', m: 1 }}>


                                <Stack spacing={1.5} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                    <TextField size='small' value={`${userDetails.first_name} ${userDetails.last_name}`} disabled fullWidth label='Sender Name' />
                                    <TextField size='small' value={selectedUser.email} disabled fullWidth label='To' />
                                    <TextField size='small' value={subject} onInput={e => setSubject(e.target.value)} required fullWidth label='Subject' />
                                    <TextField
                                        required
                                        value={birthdayMsg}
                                        onInput={e => setBirthdayMsg(e.target.value)}
                                        size='small'
                                        multiline
                                        minRows={3}
                                        maxRows={3}
                                        fullWidth
                                        label='Birthday Wish'
                                        placeholder="write your msg"
                                    />
                                </Stack>
                            </Box>
                        </Container>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type='submit' form='sendBirthdayMsg'  >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

        )
    }, [open, userDetails, selectedUser, birthdayMsg, subject])
    return (
        <>
            <Card className='birthday-list' sx={{ display: 'flex', flexDirection: 'column', height: 390, p: 0.1 }} >

                <Stack direction={'row'} justifyContent={'flex-end'} alignItems={'flex-start'} spacing={5}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', p: 0.5 }}>
                        <Typography variant="p" component="div" sx={{ display: 'flex', justifyContent: 'flex-start', fontSize: 20, alignItems: 'center' }}>
                            Birthday List <CakeIcon sx={{ m: 0.5, color: 'gray' }} fontSize='8' />
                        </Typography>

                    </Box>
                    <Box className='view-link-birthdays' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 1 }}>
                        <Link style={{ fontSize: '13px', padding: '2px', color: '#1B4688' }} to={'/crossroads'}>
                            view more
                        </Link>
                    </Box>



                </Stack>
                <Divider light />
                <Container sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', mt: 1 }} >
                    <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 80, height: 20, flexDirection: 'row' }}>
                        {months[activeStep + 1]}
                    </Paper>
                </Container>
                <Box style={{ height: 350, overflow: 'auto' }}>

                    <List sx={{ width: '100%' }}>
                        {filterBirthdayList.map((user, index) => (

                            <Box key={index}>
                                <ListItem

                                    secondaryAction={
                                        <IconButton edge="end" aria-label="comments" onClick={() => handleClickOpen(user)}>
                                            <MessageIcon sx={{ m: 1 }} />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar src={user.profile}>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.name} secondary={user.dob} />

                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </Box>

                        ))}
                    </List>
                </Box>
                <Divider light />
                <Box sx={{ width: '100%' }}>
                    <MobileStepper

                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}

                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                Next

                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                Back
                            </Button>
                        }
                    />

                </Box>

            </Card>
            {sendBirthDayWishes}
        </>
    );
}

export default BirthDayList;
