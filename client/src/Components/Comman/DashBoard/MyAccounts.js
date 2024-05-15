import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Divider, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material'
import React, { useState } from 'react'

function MyAccounts(props) {
    const {employeeInfo} = props
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
        //console.log(visible)


    }
    return (
        <Box sx={{ display: 'flex', width: '100%',height: '100%', flexDirection: 'column', justifyContent: 'center' }}>

            <Paper elevation={1} >
                <List dense>
                    <ListItem  >
                        <ListItemText primary="UAN:" />
                        {
                            visible['uan'] ?
                                <>
                                    <ListItemText secondary={employeeInfo.uan===''?'None':employeeInfo.uan} />
                                    <IconButton edge="end"size='small' onClick={() => handleVisibility('uan')}>
                                        
                                            <Visibility sx={{ color: 'gray' }} />

                                        
                                    </IconButton>

                                </> :
                                <>
                                    <ListItemText secondary="xxxxxxxxxxxxx" />
                                    <IconButton edge="end" size='small'  onClick={() => handleVisibility('uan')}>
                                        
                                            <VisibilityOff sx={{ color: 'gray' }} />

                                       
                                    </IconButton>

                                </>
                        }

                    </ListItem>
                    <Divider light />
                    <ListItem >
                        <ListItemText primary="Health Policy No:" />
                        {
                            visible['policy'] ?
                                <>
                                    <ListItemText secondary="0000000000000000-00" />
                                    <IconButton edge="end" size='small'  onClick={() => handleVisibility('policy')}>
                                        
                                            <Visibility sx={{ color: 'gray' }} />

                                       
                                    </IconButton>

                                </> :
                                <>

                                    <ListItemText secondary="xxxxxxxxxxxxx" />
                                    <IconButton edge="end" size='small' onClick={() => handleVisibility('policy')}>
                                        
                                            <VisibilityOff sx={{ color: 'gray' }} />

                                        
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
                                    <ListItemText secondary={employeeInfo.account_number===''?'None':employeeInfo.account_number} />
                                    <IconButton edge="end" size='small'  onClick={() => handleVisibility('acc')}>
                                        
                                            <Visibility sx={{ color: 'gray' }} />

                                        
                                    </IconButton>

                                </> :
                                <>

                                    <ListItemText secondary="xxxxxxxxxxxxx" />
                                    <IconButton edge="end" size='small'  onClick={() => handleVisibility('acc')}>
                                        
                                            <VisibilityOff sx={{ color: 'gray' }} />
                                       
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