import { AccountCircle, LockPerson, Visibility, VisibilityOff } from '@mui/icons-material'
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, Modal, OutlinedInput, Paper, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import React, {  useEffect} from 'react'
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
//import 'react-toastify/dist/ReactToastify.min.css'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Loader from '../Loader';



function ReportingHeadLogin() {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false);
  const [loadLogin, setLoadLogin] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [applicationStatus, setApplicationStatus] = useState('')
  const [loader, setLoader] = useState(true)

  const { status } = useParams()


  const [searchParams, setSearchParams] = useSearchParams()
  const rootRef = React.useRef(null);


  useEffect(() => {

    if (Cookies.get('HEADAUTHID') === undefined) {
      //console.log(Cookies.get('HEADAUTHID'))
      setStep(0)
      setLoader(false)

    }
    else if (Cookies.get('HEADAUTHID') !== undefined) {
      const fetchData = async () => {
        try {
          const check = await axios.post('/api/checkapplicationerequest', { status: status, applicationId: searchParams.get('id') })
          //console.log('check', check.data)
          setApplicationStatus(check.data)
          setStep(1)
          setLoader(false)

        }
        catch (err) {
          //console.log(err)
          setLoader(false)
          if(err.response.data==='Unauthorized Application'){
            toast.error(err.response.data)
            setStep(0)
          }
          else{
            setApplicationStatus(err.response.data)
          }
          

        }



      }
      fetchData()


    }

    //setLoader(false)

  }, [status, searchParams])


  //console.log('search', searchParams.get('id'))
  //console.log('status', status)
  if (status === undefined || searchParams.get('id') === null || (status !== 'approve' && status !== 'deny' && status !== 'cancel')) {
    toast.warning('invalid url for reporting head login')
    return <Navigate to='/login' replace={true} />

  }

  const Login = () => {
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleLogin = (e) => {
      e.preventDefault();
      // //console.log('login', loginDetails)
      setLoadLogin(true)


      axios.post('/api/reportingheadlogin', { ...loginDetails, status: status, applicationId: searchParams.get('id') })
        .then(res => {
          //console.log(res)

          //console.log(res.data)
          setStep(1)
          setApplicationStatus(res.data)
          setLoadLogin(false)

          //handleUserDetails(res.data)
          //navigate('/', { replace: true })
        })
        .catch(err => {

          toast.error(err.response.data)
          setSearchParams(searchParams)
          setLoadLogin(false)
        })
    }

    return (
      <>
        <Container sx={{ height: { xs: '40vh', lg: '90vh' }, width: '100%', display: 'flex' }}>
          <Grid container spacing={2} mt={1} >
            {/* <Grid item xs={12} lg={12} >
              <Typography color={'#4B4747'} fontFamily={'Miso-Light'} component={'p'} sx={{ fontSize: { xs: '20px', lg: '35px' }, textAlign: { lg: 'center' } }} variant={'p'}>LEADING THROUGH <span style={{ color: '#F167DC' }}>TECHNOLOGY</span></Typography>
            </Grid>
            <Grid item xs={12} lg={12} >
              <Typography component={'p'} color={'#4B4747'} fontFamily={'Miso-Light'} sx={{ fontSize: { xs: '20px', lg: '35px' }, textAlign: { lg: 'center' } }} variant={'p'}>WINNING THROUGH <span style={{ color: '#F167DC' }}>PEOPLE</span></Typography>
            </Grid> */}
            <Grid container >

              {/* <Grid item xs={0} lg={4}>
                <Container sx={{ display: 'flex', justifyContent: 'center', height: '400px', alignItems: 'center', width: { xs: '0ch', lg: '400px' } }}>
                  <img src='https://res.cloudinary.com/dozj3jkhe/image/upload/v1703591796/intranet/sacdwxhc2cr2lilenumw.png' alt='robo' style={{ maxWidth: '100%', maxHeight: '70%' }} />
                </Container>

              </Grid> */}
              <Grid item xs={6} sm={6} md={6} lg={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', p: 1 }} >


                  <Paper elevation={3} >

                    <Box component="form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', width: '400px' }}>
                      <Box sx={{ height: 50, m: 2 }}>

                        <img src='https://res.cloudinary.com/dozj3jkhe/image/upload/v1701168256/intranet/gdyr4cwcrsn9z1ercoku.png' alt='logo' style={{ width: '250px', height: '50px' }} />
                      </Box>
                      <Typography component={'h4'} variant='p' m={0.5}  >Reporting Head Login</Typography>

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
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
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
                      <Button onClick={() => navigate('/forgotpassword')} sx={{ m: 1 }}>forgot password?</Button>
                    </Box>

                  </Paper>

                </Box >
              </Grid>
              {/* <Grid item xs={0} lg={4}>
                <Container sx={{ display: 'flex', justifyContent: 'center', height: '400px', alignItems: 'center', width: { xs: '0ch', lg: '400px' } }}>
                  <img src='https://res.cloudinary.com/dozj3jkhe/image/upload/v1703591743/intranet/x8lfsmdftq6uo01qdmhk.png' alt='robo' style={{ maxWidth: '100%', maxHeight: '70%' }} />
                </Container>

              </Grid> */}
            </Grid>
          </Grid>

        </Container>

      </>

    )
  }

  const DisplayApplicationStatus = () => {

    return (
      <div>
        <Box
          sx={{
            height: '100vh',
            flexGrow: 1,
            minWidth: 300,
            transform: 'translateZ(0)',
            // The position fixed scoping doesn't work in IE11.
            // Disable this demo to preserve the others.
            '@media all and (-ms-high-contrast: none)': {
              display: 'none',
            },
          }}
          ref={rootRef}
        >
          <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            sx={{
              display: 'flex',
              p: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            container={() => rootRef.current}
          >
            <Box
              sx={{
                position: 'relative',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: (theme) => theme.shadows[5],
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2">
                Requst Application <Typography component={'span'} variant='p' sx={{ fontSize: 20, fontWeight: 'bold', color: (applicationStatus === 'already approved' ? 'green' : applicationStatus === 'approved' ? 'green' : 'red') }}>{applicationStatus}</Typography>
              </Typography>

            </Box>
          </Modal>
        </Box>
      </div>
    )
  }

  return (

    <>
      {
        step === 0 ? Login() : step === 1 ? DisplayApplicationStatus() : null
      }
      <Loader loader={loader} />
    </>
  )
}

export default ReportingHeadLogin