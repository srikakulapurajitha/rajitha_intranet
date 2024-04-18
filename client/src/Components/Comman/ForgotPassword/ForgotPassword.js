import { ArrowBack, LockReset, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Container, Fade, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Stack, Typography, } from '@mui/material'
import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OtpInput from 'react-otp-input';
import LoadingButton from '@mui/lab/LoadingButton'
import CryptoJS from 'crypto-js';


function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [activeView, setActiveView] = useState(0)

  const [clientOtp, setClientOtp] = useState('')
  const [showPassword, setShowPassword] = useState({ newPass: false, confirmPass: false });
  const [password, setPassword] = useState({ newPass: '', confirmPass: '' })
  const [loadSubmit, setLoadSubmit] = useState(false)
  const [loadReset, setLoadReset] = useState(false)
  const [otpRef, setOtpRef] = useState('')

  const navigate = useNavigate()

  const ForgotPassView = () => {

    const handleResetPassword = async (e) => {
      e.preventDefault()
      //console.log(email)
      setLoadSubmit(true)
      try {
        const result = await axios.post('/api/forgotpasword', { email: email })
        //console.log(result)
        const decrypted = JSON.parse(CryptoJS.AES.decrypt(result.data,process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
        //console.log(decrypted)

       
        if(decrypted!==''){
          setActiveView(1)
          //setOtp(result.data.otp)
          setOtpRef(decrypted.ref)
          toast.success(decrypted.msg)

        }
        else{
          toast.error('invalid request')
        }

        setLoadSubmit(false)
        

      }
      catch (err) {
        //console.log(err)
        setLoadSubmit(false)
        //toast.error(err.response.data)
      }
    }


    return (
      <Paper square={false} elevation={10} sx={{ p: 2, height: '350px', flexGrow: 0.1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction={'row'} display={'flex'} justifyContent={'flex-start'}>
          <IconButton onClick={() => navigate('/login')}>
            <ArrowBack />
          </IconButton>
        </Stack>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                   <img style={{ marginLeft: '10px', width: '80px', height: '80px' }} src='LOCK2.gif' alt='lock' />
          <Typography mt={2} variant='h5' component={'h5'}>Forgot/Reset Password ?</Typography>

          <Box component={'form'} onSubmit={handleResetPassword} mt={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography mb={2} variant='p' sx={{ color: 'gray' }} component={'p'}>Enter your registered email address.</Typography>
            <FormControl fullWidth >
              <InputLabel required>Email</InputLabel>
              <OutlinedInput
                sx={{ width: { xs: '25ch', lg: '40ch' } }}
                type='email'
                label='Email'
                value={email}
                required
                onInput={e => setEmail(e.target.value)}
              />
            </FormControl>
            {/* </Box></Box><Button type='submit' color='info' sx={{ mt: 2, mb: 5 }} variant='contained'>Submit</Button> */}
            <LoadingButton
              sx={{ mt: 2, mb: 5 }}
              color='info'
              type='submit'
              loading={loadSubmit}


              variant="contained"
            >
              Submit
            </LoadingButton>
          </Box>
        </Box>
      </Paper>

    )
  }


  const OtpView = useMemo(() => {
    const handleSubmitOTP = async(e) => {
      e.preventDefault()
      
     
        toast.promise(axios.post('/api/verifyotp', { email: email, ref:otpRef, clientOtp:clientOtp }), {
          pending:{
            render(){
              return 'Verifing Your Validation Code'
            }
          },
          success:{
            render(res){
              setActiveView(2)
              return res.data.data
            }
          },
          error:{
            render(err){
              console.log(err)
              return err.data.response.data
            }
          }
        })
      }
    


    return (

      <Paper square={false} elevation={10} sx={{ p: 2, maxHeight: '350px', flexGrow: 0.1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction={'row'} display={'flex'} justifyContent={'flex-start'}>
          <IconButton onClick={() => {
            setActiveView(0)
            setClientOtp('')
            setOtpRef('')
          }} >
            <ArrowBack />
          </IconButton>
        </Stack>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

          <Typography mt={2} variant='p' component={'h5'} sx={{ fontSize: { xs: '12px', lg: '20px' } }}>Enter Your 6-Digit Validation Code.</Typography>

          <Box component={'form'} onSubmit={handleSubmitOTP} mt={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <OtpInput
              value={clientOtp}
              onChange={setClientOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{ width: '25px', height: '25px', margin: '3px' }}

            />
            <Button type='submit' color='success' sx={{ mt: 2, mb: 5 }} variant='contained'>Submit</Button>
          </Box>


        </Box>
      </Paper>


    );

  }, [clientOtp, otpRef,email])


  const ResetView = () => {

    const handleResetPassword = async (e) => {
      e.preventDefault()
      if (password.newPass !== '' && password.confirmPass !== '' && password.newPass !== password.confirmPass) {
        toast.warning('confirm password must match with new password!')
      }
      else {
        setLoadReset(true)

        //console.log(email, password)
        try {
          const result = await axios.post('/api/resetpassword', { email: email, password: password.confirmPass })
          toast.success(result.data)
          setLoadReset(false)
          setEmail('')
          setActiveView(0)
          setClientOtp('')
          setOtpRef('')
          setPassword('')
          setShowPassword('')
          navigate('/login')
          

        }
        catch (err) {
          //console.log(err)
          setLoadReset(false)
          toast.error(err.response.data)
        }
      }


    }

    return (
      <Fade in={activeView === 2} timeout={2000}>
        <Paper square={false} elevation={10} sx={{ p: 2, maxHeight: '350px', flexGrow: 0.1, display: 'flex', flexDirection: 'column' }}>
          <Stack maxHeight={25} direction={'row'} display={'flex'} justifyContent={'flex-start'}>
            <IconButton size='small' onClick={() => {
              setActiveView(0)
              setClientOtp('')
              setOtpRef('')
              setPassword({ newPass: '', confirmPass: '' })
              setShowPassword({ newPass: false, confirmPass: false });
            }} >
              <ArrowBack />
            </IconButton>
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            <svg
              width='60px'
              height='60px'
            >
              <LockReset sx={{ color: '#00ACFF', fontSize: 40 }} />
            </svg>

            <Typography mt={1} variant='p' component={'h5'} sx={{ fontSize: { xs: '12px', lg: '20px' } }}>Reset Your Password</Typography>

            <Box component={'form'} onSubmit={handleResetPassword} mt={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput
                    name='newPass'
                    required={true}
                    value={password.newPass}
                    onInput={e => setPassword({ ...password, newPass: e.target.value })}
                    type={showPassword.newPass ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword({ ...showPassword, newPass: !showPassword.newPass })}
                          onMouseDown={() => setShowPassword({ ...showPassword, newPass: !showPassword.newPass })}
                          edge="end"
                        >
                          {showPassword.newPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel error={password.newPass !== '' && password.confirmPass !== '' && password.newPass !== password.confirmPass}>Confirm Password</InputLabel>
                  <OutlinedInput
                    error={password.newPass !== '' && password.confirmPass !== '' && password.newPass !== password.confirmPass}
                    name='confirmPass'
                    value={password.confirmPass}
                    onInput={e => setPassword({ ...password, confirmPass: e.target.value })}
                    required={true}
                    type={showPassword.confirmPass ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword({ ...showPassword, confirmPass: !showPassword.confirmPass })}
                          onMouseDown={() => setShowPassword({ ...showPassword, confirmPass: !showPassword.confirmPass })}
                          edge="end"
                        >
                          {showPassword.confirmPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>
              </Stack>

              <LoadingButton

                type='submit'
                loading={loadReset}
                color='info'
                sx={{ mt: 2, mb: 5 }}
                variant="contained"

              >
                Submit
              </LoadingButton>
              
            </Box>
          </Box>
        </Paper>
      </Fade>
    )
  }


  //views
  const views = [ForgotPassView(), OtpView, ResetView()]

  return (
    <>
      <Box component='main' sx={{ flexGrow: 1, }}>
        <Container sx={{ height: '90vh', width: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {
            views[activeView]
          }
        </Container>
      </Box>


    </>
  )
}

export default ForgotPassword