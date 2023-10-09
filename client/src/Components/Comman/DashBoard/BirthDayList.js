import { Avatar, Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, MobileStepper, Paper, TextField, Typography, useMediaQuery } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import MessageIcon from '@mui/icons-material/Message';
import React from 'react';
import { useTheme } from 'styled-components';

const BirthDayList = () => {
    const [activeStep, setActiveStep] = React.useState(new Date().getMonth());
    const maxSteps = 12;

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
    console.log(activeStep)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    return (
        <>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: 390, p: 1 }} >
                <Typography variant="p" component="div" sx={{ display: 'flex', justifyContent: 'center', fontSize: 20, alignItems: 'center' }}>
                    Birthday List <CakeIcon fontSize='8' />
                </Typography>
                <Divider light />


                {/* <Box  sx={{display:'flex',flexDirection:'column',justifyItems:'center',maxHeight:270,scrollBehavior:'smooth'}}>
            
            <Box  sx={{display:'flex', height:50, width:'100%', alignItems:'center', justifyContent:'space-around',mt:1.5,borderBottom:'1px solid gray'}} > 
                <Avatar alt="Remy Sharp" src="profile.jpg" sx={{ml:3}} />
                <Container sx={{display:'flex', flexDirection:'column', }}>
                    <Typography variant="p" component="div" fontSize={20} >
                        Akash Dandge
                    </Typography>
                    <Typography variant="p" component="div" color={'gray'}  >
                        02-Jan
                    </Typography>
                </Container>
                <MessageIcon sx={{fontSize:20,color:'grey'}} />
            </Box> 
            
        </Box> 
                    */}
                <Container sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', mt: 1 }} >
                    <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 80, height: 20, flexDirection: 'row' }}>
                        {months[activeStep + 1]}
                    </Paper>
                </Container>
                <Box style={{ height: 350, overflow: 'auto' }}>

                    <List sx={{ width: '100%' }}>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments" onClick={handleClickOpen}>
                                    <MessageIcon sx={{ m: 1 }} />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge Akash Dandge " secondary="Jan 2" />

                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <Dialog

                            open={open}
                            onClose={handleClose}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                {"Send Birthday Wishes 🥳"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{m:1}}>
                                    To: akashd@brightcomgroup.com
                                </DialogContentText>
                                
                                <TextField
                                    id="outlined-multiline-static"
                                    sx={{width:'30ch',m:1}}
                                    multiline
                                    minRows={4}
                                    maxRows={8}
                                    placeholder="write your msg"
                                    />

                                <DialogContentText sx={{m:1}}>
                                     From: Akash Dandge
                                </DialogContentText>
                                
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button onClick={handleClose} autoFocus>
                                    Send
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src="profile.jpg">

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Akash Dandge" secondary="Jan 2" />
                            <ListItemAvatar>
                                <MessageIcon sx={{ color: 'gray' }} />
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" /> */}

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
        </>
    );
}

export default BirthDayList;
