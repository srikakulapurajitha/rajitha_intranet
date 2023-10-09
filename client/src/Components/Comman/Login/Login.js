import { AccountCircle, LockPerson, NoEncryption, Visibility, VisibilityOff } from '@mui/icons-material'
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Container, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react'
import { useState } from 'react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loadLogin, setLoadLogin] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = (e) =>{
    e.preventDefault();
    console.log('login')
    setLoadLogin(true)
  }
  return (
    <div style={{height: '100%', width: '100%', display: 'flex'}}>
     
      <Box   sx={{display:'flex',justifyContent:'center', alignItems: 'center',height:'100%', width: '100%', m:2,p:1}} >
     
          <Paper elevation={3} >
         
              <Box component="form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px',width:'400px'  }}>
              <Box sx={{height:50,m:1}}>
               
                <img src='logo.png' alt='logo' />
              </Box>
            
            <Box  sx={{ display: 'flex', justifyContent:'center', alignItems: 'center'}}>
              <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5, fontSize: 40 }} />
              <FormControl   sx={{ m: 1, width: '30ch'}}  variant="outlined">
                <InputLabel required htmlFor="outlined-adornment-email">Email</InputLabel>
                <OutlinedInput
                  required={true}
                  id="outlined-adornment-email"
                  type={'email'}
                  label="Email"
                />
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center'}}>
              <LockPerson sx={{ color: 'action.active', mr: 1, my: 0.5, fontSize: 40 }} />
              <FormControl  sx={{ m: 1 , width: '30ch'}} variant="outlined">

                <InputLabel required htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
            <Button sx={{m:1}}>forgot password?</Button>
                  </Box>
                 
          </Paper>
       
      </Box >
 
    </div>
  )
}

export default Login