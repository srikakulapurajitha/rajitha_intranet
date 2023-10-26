import { AccountCircle, LockPerson,  Visibility, VisibilityOff } from '@mui/icons-material'
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useContext } from 'react'
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';



function Login() {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false);
  const [loadLogin, setLoadLogin] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { handleUserDetails } = useContext(UserContext)
  const navigate = useNavigate()


  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('login', loginDetails)
    setLoadLogin(true)


    axios.post('/api/login', loginDetails)
      .then(res => {
        console.log(res)
        setLoadLogin(false)
        console.log(res.data)
        handleUserDetails(res.data)
        navigate('/', { replace: true })
      })
      .catch(err => {
        toast.error(err.response.data)
        setLoadLogin(false)
      })
  }
  if (Cookies.get('USERAUTHID') !== undefined) {
    console.log('present')
    return <Navigate to='/' replace={true} />
  }
  
  return (
    <>
      <Container sx={{ height: { xs: '40vh', lg: '90vh' }, width: '100%', display: 'flex' }}>
        <Grid container spacing={2} mt={1} >
          <Grid item xs={12} lg={12} >
            <Typography color={'#4B4747'} fontFamily={'Miso-Light'} component={'p'} sx={{ fontSize: { xs: '20px', lg: '50px' }, textAlign: { lg: 'center' } }} variant={'p'}>LEADING THROUGH <span style={{ color: '#F167DC' }}>TECHNOLOGY</span></Typography>
          </Grid>
          <Grid container >

            <Grid item xs={0} lg={4}>
            <Container sx={{ display: 'flex', justifyContent: 'center', height: '400px', alignItems:'center', width: { xs: '0ch', lg: '400px' } }}>
                <img src='robo2.png' alt='robo' style={{ maxWidth: '100%', maxHeight: '80%' }} />
              </Container>

            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={4}>
              <Box sx={{ display: 'flex', justifyContent: 'flext-start', alignItems: 'center', height: '100%', width: '100%', p: 1 }} >


                <Paper elevation={3} >

                  <Box component="form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', width: '400px' }}>
                    <Box sx={{ height: 50, m: 1 }}>

                      <img src='bcglogo.png' alt='logo' style={{ width: '197px', height: '40px' }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5, fontSize: 40 }} />
                      <FormControl sx={{ m: 1, width: '30ch' }} variant="outlined">
                        <InputLabel required htmlFor="outlined-adornment-email">Email</InputLabel>
                        <OutlinedInput
                          onInput={e => setLoginDetails({ ...loginDetails, email: e.target.value })}
                          required={true}
                          id="outlined-adornment-email"
                          type={'email'}
                          label="Email"
                        />
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <LockPerson sx={{ color: 'action.active', mr: 1, my: 0.5, fontSize: 40 }} />
                      <FormControl sx={{ m: 1, width: '30ch' }} variant="outlined">

                        <InputLabel required htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                          onInput={e => setLoginDetails({ ...loginDetails, password: e.target.value })}
                          required={true}
                          id="outlined-adornment-password"
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ?  <Visibility /> :<VisibilityOff /> }
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>
                    </Box>
                    <Box m={1}>

                      <LoadingButton
                        color="success"
                        type='submit'
                        loading={loadLogin}

                        loadingPosition="end"
                        endIcon={<LoginIcon />}
                        variant="contained"
                      >
                        <span>Login</span>
                      </LoadingButton>
                    </Box>
                    <Button onClick={()=>navigate('/forgotpassword')} sx={{ m: 1 }}>forgot password?</Button>
                  </Box>

                </Paper>

              </Box >
            </Grid>


            <Grid item xs={0} lg={4}>
              <Container sx={{ display: 'flex', justifyContent: 'center', height: '400px', alignItems:'center', width: { xs: '0ch', lg: '400px' } }}>
                <img src='robo.png' alt='robo' style={{ maxWidth: '100%', maxHeight: '80%' }} />
              </Container>

            </Grid>
          </Grid>




          <Grid item xs={12} lg={12} >
            <Typography component={'p'} color={'#4B4747'} fontFamily={'Miso-Light'} sx={{ fontSize: { xs: '20px', lg: '50px' }, textAlign: { lg: 'center' } }} variant={'p'}>WINNING THROUGH <span style={{ color: '#F167DC' }}>PEOPLE</span></Typography>
          </Grid>


        </Grid>

      </Container>
      
    </>
  )
}

export default Login