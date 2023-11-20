import React, { useContext, useState } from 'react';
import { Box, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, Typography } from '@mui/material';
import UserNavBar from '../NavBar/UserNavBar';
import AdminNavBar from '../NavBar/AdminNavBar';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../context/UserContext';
import { LockOpen, LockReset, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
    const [error, setError] = useState(false);

    const { userDetails } = useContext(UserContext)
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'confirmNewPassword' || name === 'newPassword') {
            setFormData({ ...formData, [name]: value });
            if (value !== formData.newPassword && value !== '') {
                setError(true);
            } else {
                setError(false);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!error && formData.newPassword===formData.confirmNewPassword&&formData.oldPassword!==formData.confirmNewPassword) {
            toast.promise(
                axios.post('/api/changepassword', { ...formData, email: userDetails.email }),
                {
                    pending: {
                        render() {
                            return('Updating password');
                        },
                    },
                    success: {
                        render(res) {
                            setFormData({oldPassword:'',newPassword:'',confirmNewPassword:''})
                            setShowPassword({ old: false, new: false, confirm: false })
                            
                            axios.get('/api/logout')
                            .then(()=>{
                                navigate('/login',{replace:true})
                                
                            })
                            .catch(()=>toast.error('error occured!'))
                            return(res.data.data)
                                
                               
                              
                            
                        },
                    },
                    error: {
                        render(err) {
                            return(err.data.response.data)
                        },
                    },
                }
            );
        }
        else if(formData.oldPassword===formData.confirmNewPassword){
            toast.warning(`old password can't be new password!`)

        }
        else{
            toast.warning(`new password and confirm password doesn't match!`)
        }
    };
    const handleClickShowPassword=(option)=>{
        switch(option){
            case 'old':
                setShowPassword({...showPassword,old:!showPassword.old})
                break
            case 'new':
                setShowPassword({...showPassword,new:!showPassword.new})
                break
            case 'confirm':
                setShowPassword({...showPassword,confirm:!showPassword.confirm})
                break
            default:
                setShowPassword({ old: false, new: false, confirm: false })

        }

    }

    const handleMouseDownPassword=(option)=>{
        switch(option){
            case 'old':
                setShowPassword({...showPassword,old:!showPassword.old})
                break
            case 'new':
                setShowPassword({...showPassword,new:!showPassword.new})
                break
            case 'confirm':
                setShowPassword({...showPassword,confirm:!showPassword.confirm})
                break
            default:
                setShowPassword({ old: false, new: false, confirm: false })

        }


    }

    

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

            {userDetails.access === 'admin' ? <AdminNavBar /> : <UserNavBar />}

            <Paper elevation={10} sx={{ p: 4, mt: 4, maxWidth: 400, margin: '0 auto' }}>
                <Typography textAlign={'center'} variant="h5" component="div" sx={{ mb: 2 }}>
                    Change Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                        <InputLabel required htmlFor="outlined-adornment-oldPassword">
                            Old Password
                        </InputLabel>
                        <OutlinedInput
                            name="oldPassword"
                            required

                            label="Old Password"
                            placeholder="Old Password"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            type={showPassword.old ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={()=>handleClickShowPassword('old')}
                                        onMouseDown={()=>handleMouseDownPassword('old')}
                                        edge="end"
                                    >
                                        {showPassword.old ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                        <InputLabel required htmlFor="outlined-adornment-newPassword">
                            New Password
                        </InputLabel>
                        <OutlinedInput
                            name="newPassword"
                            required

                            label="New Password"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            type={showPassword.new ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={()=>handleClickShowPassword('new')}
                                        onMouseDown={()=>handleMouseDownPassword('new')}
                                    >
                                        {showPassword.new ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                        <InputLabel error={error} required>
                            Confirm New Password
                        </InputLabel>
                        <OutlinedInput
                            error={error}
                            name="confirmNewPassword"
                            required

                            label="Confirm New Password"
                            placeholder="Confirm New Password"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            type={showPassword.confirm ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={()=>handleClickShowPassword('confirm')}
                                    onMouseDown={()=>handleMouseDownPassword('confirm')}
                                    edge="end"
                                    >
                                        {showPassword.confirm ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                        <Button type="submit" variant="contained" color="info">
                            Submit
                        </Button>
                    </Box>
                </form>
            </Paper>

        </div>
    );
}

export default ChangePassword;
