import React, { useState } from 'react'
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'

function SendBirthDayWishes(props) {
    const [birthdayMsg, setBirthdayMsg] = useState('')
    const [subject ,setSubject] = useState('')
    const { sendData } = props

    const handleSubmitForm = (e) =>{
        e.preventDefault()
        if(birthdayMsg!=='' && subject!==''){
            toast.promise(axios.post('/api/sendbirthdaywishes',{...sendData,subject:subject,msg:birthdayMsg}),{
                pending:{
                    render(){
                        return('sending birthday wishes')
                    }
                },
                success:{
                    render(res){
                        setBirthdayMsg('')
                        setSubject('')
                        return(res.data.data)
                    }
                },
                error:{
                    render(err){
                        return(err.data.response.data)
                    }
                }
            })
            

        }
    }
    return (
        <Paper sx={{ display: "flex", flexDirection: 'column', minHeight: "350px", "&:hover": { boxShadow: 10 } }}>

            <Typography color={'#FF7E00'} component={'h4'} variant='p' ml={0.5}>Send Birthday Wishes 🥳</Typography>
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box onSubmit={handleSubmitForm} component={'form'} sx={{width:'80%',m:2}}>
                    
                    <Stack spacing={1.5} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <TextField size='small' value={sendData.name} disabled fullWidth label='Sender Name' />
                        <TextField size='small' value={sendData.to} disabled fullWidth label='To' />
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
                         <Button type='submit' sx={{width:'60%'}} variant='contained' size='small'>Send</Button>
                    </Stack>
                   


                </Box>





            </Container>


        </Paper>
    )
}

export default SendBirthDayWishes