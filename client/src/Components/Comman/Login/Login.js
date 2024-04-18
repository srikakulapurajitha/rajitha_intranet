import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

import { Box, Button, FormControl, Grid, IconButton, InputAdornment, Container, InputLabel, OutlinedInput, Paper, Typography, Stack, } from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import { AccountCircle, LockPerson, Visibility, VisibilityOff } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { UserAccessContext } from '../../context/UserAccessContext';
import Marquee from 'react-fast-marquee';
import CryptoJS from 'crypto-js';

function Login() {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loadLogin, setLoadLogin] = useState(false);
  const { handleUserDetails } = useContext(UserContext);
  const { updateAccess } = useContext(UserAccessContext)
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  //zoom
  useEffect(() => {
    const initialValue = document.body.style.zoom;

    // Change zoom level on mount
    document.body.style.zoom = "95%";

    return () => {
      // Restore default value
      document.body.style.zoom = initialValue;
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoadLogin(true);

    axios.post('/api/login', loginDetails)
      .then((res) => {
        setLoadLogin(false);
        const decrypted = JSON.parse(CryptoJS.AES.decrypt(res.data,process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
        handleUserDetails(decrypted);
        updateAccess()
        navigate('/', { replace: true });
      })
      .catch((err) => {
        toast.error(err.response.data);
        setLoadLogin(false);
      });
  };

  if (Cookies.get('USERAUTHID') !== undefined) {
    return <Navigate to="/" replace={true} />;
  }



  return (
    <>

      <Grid container sx={{ border: '13px solid transparent', borderImage: 'linear-gradient(135deg, #7873f5 10%, #ec77ab  100%);', borderImageSlice: 1, minHeight: '100vh' }} >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '13px solid transparent', borderImage: 'linear-gradient(135deg, #7873f5 10%, #ec77ab  100%);', borderImageSlice: 1, borderRadius: '10px' }} >
            <img style={{ objectFit: 'contain', width: '220px', height: '60px' }} src='bcglogo.png' alt='logo' />
            {/* <Stack spacing={-0.5}>
              <Typography variant="subtitle1" color={'ButtonText'} style={{ textAlign: "center", justifyContent: "center", alignItems: 'center', color: 'gray', fontSize: '20px' }}>
                {time.clock}
              </Typography>
              <Typography variant='subtitle2' color={'ButtonText'} sx={{ color: 'gray' }}>{time.day} </Typography>

            </Stack> */}
          </Box>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} sx={{ backgroundColor: '#f6f6ff', height: 'auto' }} >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:'auto' }} >
            <img style={{ marginTop: 'auto', objectFit: 'contain', maxWidth: '100%', maxHeight: '500px', borderTopRightRadius: '90px', borderTopLeftRadius: '90px' }} src='x4.gif' alt='loginPic' />
            {/* <svg width="auto" height="500px" 
     >
  <image objectFit='contain' href="x1.gif" x="0" y="0" maxHeight="auto"maxWidth="100%" />
</svg> */}
          </Box>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} sx={{ backgroundColor: '#f6f6ff' }} >
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: 2 }}>
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                      <AccountCircle sx={{ color: 'action.active', mr: 1, fontSize: 35 }} />
                      <FormControl fullWidth variant="outlined">
                        <InputLabel size='small' required >Email</InputLabel>
                        <OutlinedInput
                          autoComplete='username'
                          size='small'
                          onInput={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
                          required={true}
                          type={'email'}
                          label="Email"
                        />
                      </FormControl>
                    </Box>

                  </>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <LockPerson sx={{ color: 'action.active', mr: 0.5, fontSize: 35 }} />
                    <FormControl fullWidth sx={{ width: '100%' }} variant="outlined">
                      <InputLabel size='small' required>Password</InputLabel>
                      <OutlinedInput
                        onInput={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
                        required={true}
                        autoComplete='current-password'
                        type={showPassword ? 'text' : 'password'}
                        size='small'
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton

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
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton
                      style={{ backgroundColor: '#1771f5', color: 'white' }} // Set background color to purple and text color to white
                      type='submit'
                      loading={loadLogin}
                      loadingPosition="end"
                      endIcon={<LoginIcon fontSize='small' />}
                      variant="contained"
                    >
                      Login
                    </LoadingButton>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
              <Button style={{ color: '#002db3', }} onClick={() => navigate('/forgotpassword', { relative: true })} sx={{ m: 1 }}>forgot password?</Button>
            </Container>
            <Paper elevation={24} sx={{ p: 1, height: '100%', width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden' }} spacing={2}>
  <Box sx={{ p: 0.5, mt: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'justify', maxWidth: '100%', maxHeight: '100%', fontFamily: 'Miso-Light', overflow: 'auto' }}>
   <Typography component={'h3'} color={'#ff34ee'} variant='p' textAlign={'center'}>WELCOME TO BRIGHTCOMGROUP</Typography>
                <Box sx={{ fontSize: '13px', color: '#212529' }}>
                  <Typography variant="p" display="block" mt={1}  >
                    Brightcom Group consolidates Ad-tech, New Media and IoT based businesses across the globe, primarily in the digital eco-system. Our divisions include Brightcom Media, VoloMP, Consumer Products and Dyomo. Brightcom Group?s consumer products division is focused on IoT. Our LIFE product is dedicated to the future of communication and information management in which everyday objects will be connected to the internet, also known as the ?Internet of Things? (IoT).
                  </Typography>
                  <Typography variant="p" mt={2} display="block"   >
                    Brightcom Group?s renowned global presence, including in the US, Israel, Latin America ME, Western Europe and Asia Pacific regions, positions us at the forefront of the digital landscape, enabling us to support partners in their efforts to leverage and benefit from current global trends. We have the technological platform and human knowledge to do so.
                  </Typography>
                  <Typography variant="p" mt={2} display="block"   >
                    Our clients include leading blue chip advertisers such as Airtel, British Airways, Coca-Cola, Hyundai Motors, ICICI Bank, ITC, ING, Lenovo, LIC, Maruti Suzuki, MTV, P&G, Qatar Airways, Samsung, Viacom, Sony, Star India, Vodafone, Titan, and Unilever. Publishers include Facebook, LinkedIn, MSN, Twitter, and Yahoo! Brightcom works with agencies like Havas Digital, JWT, Mediacom, Mindshare, Neo@Ogilvy, Ogilvy One, OMD, Satchi&Satchi, TBWA, and ZenithOptiMedia, to name a few.
                  </Typography>
                  <Marquee direction='right' style={{ maxWidth: '100%' }}>
                    <Stack spacing={2} display={'flex'} justifyContent={'center'} direction={'row'}>
                      <img style={{ objectFit: 'contain', width: '120px', height: '80px' }} src='brightcommedia.png' alt='brightcommedia' />
                      <img style={{ objectFit: 'contain', width: '120px', height: '80px' }} src='VOLOMP.png' alt='VOLOMP' />
                      <img style={{ objectFit: 'contain', width: '120px', height: '80px' }} src='LilProjects.png' alt='LilProjects' />
                      <img style={{ objectFit: 'contain', width: '120px', height: '80px' }} src='dyomo.png' alt='dyomo' />
                      <img style={{ objectFit: 'contain', width: '120px', height: '80px' }} src='DREAMAD.png' alt='DREAMAD' />


                    </Stack>
                  </Marquee>
                </Box>
              </Box>


            </Paper>

          </Box>

        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box
            component="footer"
            sx={{
              // backgroundColor:'white',
              background: 'linear-gradient(135deg, #7873f5 10%, #ec77ab  100%);',
              padding: '10px',
              textAlign: 'center',
              position: {xs:'sticky',sm:'sticky',md:'fixed',lg:'fixed',xl:'fixed'},
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%'
            }}

          >
            <Typography variant="body2" color="white">
              Copyright © 2024 brightcomgroup. All Rights Reserved | Privacy Policy.
            </Typography>
          </Box>



        </Grid>
      </Grid>





    </>
  )
}

export default Login