import { ArrowBack, LockReset, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button,  Container, Fade, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OtpInput from 'react-otp-input';

function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [activeView, setActiveView] = useState(0)
  const [otp, setOtp] = useState('')
  const [clientOtp, setClientOtp] = useState('')
  const [showPassword, setShowPassword] = useState({ newPass: false, confirmPass: false });
  const [password, setPassword] = useState({ newPass: '', confirmPass: '' })

  const navigate = useNavigate()

  const ForgotPassView = useMemo(() => {

    const handleResetPassword = (e) => {
      e.preventDefault()
      console.log(email)
      try {
        toast.promise(axios.post('/api/forgotpasword', { email: email }), {
          pending: {
            render() {
              return ('sending otp')
            }
          },
          success: {
            render(res) {
              console.log(res)
              setActiveView(1)
              setOtp(res.data.data.otp)
              return res.data.data.msg
            }
          },
          error: {
            render(err) {
              return (err.data.response.data)
            }
          }

        })
      }
      catch (err) {
        console.log(err)
        toast.error('Unable send please check your internet connection!')
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
          {/* <svg
            width='80px'
            height='80px'
            >
              <LockReset sx={{ color:'#00ACFF',fontSize: 40 }} />
            </svg> */}

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
            <Button type='submit' color='info' sx={{ mt: 2, mb: 5 }} variant='contained'>Submit</Button>
          </Box>
        </Box>
      </Paper>

    )
  }, [email, navigate])


  const OtpView = useMemo(() => {
    const handleSubmitOTP = (e) => {
      e.preventDefault()
      console.log(clientOtp, otp)
      if (clientOtp !== otp) {

        toast.error('Invalid Otp!')
      }
      else {
        setActiveView(2)
      }
    }


    return (

      <Paper square={false} elevation={10} sx={{ p: 2, maxHeight: '350px', flexGrow: 0.1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction={'row'} display={'flex'} justifyContent={'flex-start'}>
          <IconButton onClick={() => {
            setActiveView(0)
            setClientOtp('')
            setOtp('')
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

  }, [clientOtp, otp])


  const ResetView = useMemo(() => {

    const handleResetPassword = (e) => {
      e.preventDefault()
      if (password.newPass !== '' && password.confirmPass !== '' && password.newPass !== password.confirmPass) {
        toast.warning('confirm password must match with new password!')
      }
      else {
        console.log(email,password)
        try{
          toast.promise(axios.post('/api/resetpassword',{email:email,password:password.confirmPass}),{
            pending:{
              render(){
                return('Reseting your password')
              }
            },
            success:{
              render(res){
                setEmail('')
                setActiveView(0)
                setClientOtp('')
                setOtp('')
                setPassword('')
                setShowPassword('')
                navigate('/login')
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
        catch{
          toast.error('Something went wrong. Please check your internet connection!')
        }
      }
    }

    return (
      <Fade in={activeView===2} timeout={2000}>
      <Paper square={false} elevation={10} sx={{ p: 2, maxHeight: '350px', flexGrow: 0.1, display: 'flex', flexDirection: 'column' }}>
        <Stack maxHeight={25} direction={'row'} display={'flex'} justifyContent={'flex-start'}>
          <IconButton size='small' onClick={() => {
            setActiveView(0)
            setClientOtp('')
            setOtp('')
            setPassword({newPass:'',confirmPass:''})
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
            <Button type='submit' color='info' sx={{ mt: 2, mb: 5 }} variant='contained'>Submit</Button>
          </Box>
        </Box>
      </Paper>
      </Fade>
    )
  }, [showPassword, password,activeView,email,navigate])


  //views
  const views = [ForgotPassView, OtpView, ResetView]

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