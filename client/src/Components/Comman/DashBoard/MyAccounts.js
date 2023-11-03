import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper } from '@mui/material'
import React, { useState } from 'react'

function MyAccounts() {
    const [visible, setVisible] = useState({ 'uan': false, 'policy': false, 'acc': false })
    const handleVisibility = (acctype) => {
        //console.log(visible[acctype])
        switch (acctype) {
            case 'uan':
                setVisible({ ...visible, 'uan': !visible['uan'] })
                break
            case 'policy':
                setVisible({ ...visible, 'policy': !visible['policy'] })
                break
            case 'acc':
                setVisible({ ...visible, 'acc': !visible['acc'] })
                break
            default:
                setVisible({ ...visible })
        }

        //setVisible({...visible,acctype:!visible[acctype]})
        console.log(visible)


    }
    return (
        <Box sx={{ display: 'flex', width: '100%',height: '100%', flexDirection: 'column', justifyContent: 'center' }}>

            <Paper elevation={1} >
                <List>
                    <ListItem  >
                        <ListItemText primary="UAN:" />
                        {
                            visible['uan'] ?
                                <>
                                    <ListItemText secondary="1234567890" />
                                    <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('uan')}>
                                        <ListItemAvatar>
                                            <Visibility sx={{ color: 'gray' }} />

                                        </ListItemAvatar>
                                    </IconButton>

                                </> :
                                <>
                                    <ListItemText secondary="xxxxxxxxxxxxx" />
                                    <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('uan')}>
                                        <ListItemAvatar>
                                            <VisibilityOff sx={{ color: 'gray' }} />

                                        </ListItemAvatar>
                                    </IconButton>

                                </>
                        }

                    </ListItem>
                    <Divider light />
                    <ListItem >
                        <ListItemText primary="Policy No:" />
                        {
                            visible['policy'] ?
                                <>
                                    <ListItemText secondary="4101230200000205-00" />
                                    <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('policy')}>
                                        <ListItemAvatar>
                                            <Visibility sx={{ color: 'gray' }} />

                                        </ListItemAvatar>
                                    </IconButton>

                                </> :
                                <>

                                    <ListItemText secondary="xxxxxxxxxxxxx" />
                                    <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('policy')}>
                                        <ListItemAvatar>
                                            <VisibilityOff sx={{ color: 'gray' }} />

                                        </ListItemAvatar>
                                    </IconButton>

                                </>
                        }
                    </ListItem>
                    <Divider light />
                    <ListItem >
                        <ListItemText primary="Salary Account No:" />
                        {
                            visible['acc'] ?
                                <>
                                    <ListItemText secondary="793601500083" />
                                    <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('acc')}>
                                        <ListItemAvatar>
                                            <Visibility sx={{ color: 'gray' }} />

                                        </ListItemAvatar>
                                    </IconButton>

                                </> :
                                <>

                                    <ListItemText secondary="xxxxxxxxxxxxx" />
                                    <IconButton edge="end" aria-label="comments" onClick={() => handleVisibility('acc')}>
                                        <ListItemAvatar>
                                            <VisibilityOff sx={{ color: 'gray' }} />
                                        </ListItemAvatar>
                                    </IconButton>

                                </>
                        }
                    </ListItem>
                </List>
            </Paper>
        </Box>
    )
}

export default MyAccounts