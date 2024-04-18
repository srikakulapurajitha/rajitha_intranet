import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, Typography } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Cached, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";
import { generate } from '@wcj/generate-password';
import { MobileDatePicker } from "@mui/x-date-pickers";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

import AccessNavBar from "../../Comman/NavBar/AccessNavBar";
//import 'react-toastify/dist/ReactToastify.min.css' 


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


function AddUser() {
    const [addUserData, setAddUserData] = useState({
        profile: "",
        firstName: "",
        lastName: "",
        gender: "",
        bloodGroup: "",
        dob: null,
        country: "India",
        companyName: "",
        aboutYourself: "",
        employeeId: "",
        userType: "",
        department:"",
        shift:"",
        email: "",
        password: "",
        pastExpDomain:'',
        pastExpYears:0,
        designation: "",
        dateOfJoining: new Date().toLocaleDateString('en-CA'),
        status: "",
    });
    const [companyNames, setCompanyNames] = useState([])
    const [error, setError] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [updates, setUpdates] = useState(0)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    //taking companay names from db
    useEffect(() => {
        axios.get('/api/companynames')
            .then(res => {
                //console.log(res.data)
                setCompanyNames(res.data)
            })
            .catch((err)=>toast.error(err.response.data))
        axios.get('/api/getemployeeid')
            .then(res => setAddUserData({
                profile: "",
                firstName: "",
                lastName: "",
                gender: "",
                bloodGroup: "",
                dob: null,
                country: "India",
                companyName: "",
                aboutYourself: "",
                employeeId: res.data.employee_id,
                userType: "",
                department:"",
                shift:"",
                email: "",
                password: "",
                pastExpDomain:'',
                pastExpYears:0,
                designation: "",
                dateOfJoining: new Date().toLocaleDateString('en-CA'),
                status: "",
                
            }))
            .catch((err)=>toast.error(err.response.data))
    }, [updates])

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                //console.log('err',error)
                reject(error);
            };
        });
    };

    const handleCapture = (e) => {

        //console.log('f',e.target.files[0])
        const file = e.target.files[0];
        if (file !== undefined) {
            const imgname = e.target.files[0].name;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxSize = Math.max(img.width, img.height);
                    //console.log(maxSize,(maxSize - img.width) / 2)
                    canvas.width = maxSize;
                    canvas.height = maxSize;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(
                        img,
                        (maxSize - img.width) / 2,
                        (maxSize - img.height) / 2
                    );
                    canvas.toBlob(
                        async (blob) => {
                            const file = new File([blob], imgname, {
                                type: "image/png",
                                lastModified: Date.now(),
                            });

                            //console.log(file);
                            const url = await convertBase64(file)
                            //console.log('base64', url )

                            setAddUserData({ ...addUserData, profile: url });
                        },
                        "image/jpeg",
                        0.8
                    );
                };
            };
        }
        else {
            setAddUserData({ ...addUserData, profile: '' })
        }
    }

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)",
        "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Côte d'Ivoire", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
        "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
        "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
        "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
        "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
        "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
        "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
        "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
        "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
        "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
        "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
        "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
        "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay",
        "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];


    const handleUserDataChange = (e) => {
        //console.log(e.target.name)
        setAddUserData({ ...addUserData, [e.target.name]: e.target.value })
    }

    const handleUserDataClear = () => {
        setAddUserData({
            ...addUserData,
            profile: "",
            firstName: "",
            lastName: "",
            gender: "",
            bloodGroup: "",
            dob: null,
            country: "India",
            companyName: "",
            aboutYourself: "",
            userType: "",
            department:"",
            shift:"",
            email: "",
            password: "",
            pastExpDomain:'',
            pastExpYears:0,
            designation: "",
            dateOfJoining: new Date().toLocaleDateString('en-CA'),
            status: "",
        })
    }

    const handlePasswordGenerate = () => {

        const pass = generate({ length: 8, special: false })
        //console.log(pass) 
        setAddUserData({ ...addUserData, password: pass })


    }

    const handleUserDataSubmit = (e) => {
        // const formData = new FormData()
        // formData.append('profile',addUserData.profile)
        e.preventDefault()
        //console.log(addUserData)


        if (!addUserData.dob) {
            //console.log(addUserData.dob)
            setError(true)
        }
        else if(addUserData.firstName===addUserData.lastName){
            toast.warning('First name and Last name cant be same')

        }
        else {
            //console.log('hey')
            try {
                toast.promise(axios.post('/api/adduser', addUserData), {
                    pending: {
                        render() {
                            return ('Adding User Details')
                        }
                    },
                    success: {
                        render(res) {
                            handleUserDataClear()
                            setUpdates(prev=>prev+1)
                            return (res.data.data)
                        }
                    },
                    error: {
                        render(err) {
                            //console.log('hey', err)
                            return (err.data.response.data)
                        }
                    }
                })
                //console.log(result)
            }
            catch (err) {

                //console.log(err)
                //toast.error(err.response.data)
            }
        }
    }





    return (
        <>

            <Box sx={{ height: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
               <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: 'auto',
                            width: '100%',

                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Add User</Typography>
                        <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
                            <Grid item sm={12} lg={11} md={12} >

                                <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' , height:'100%', p: 1 }}>
                                    <form onSubmit={handleUserDataSubmit}>


                                        <Container sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center' }}>
                                            <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' }, borderBottom: { xs: '1px solid black', lg: 'none' } }}>
                                                <Typography variant="p" component={'h5'} m={1} textAlign={'center'}>Personal Details</Typography>
                                                <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                    {addUserData.profile ?
                                                        <Avatar src={addUserData.profile} sx={{ width: 46, height: 46, }} /> :
                                                        <Avatar sx={{ width: 46, height: 46, }} />
                                                    }
                                                    {
                                                        <Stack direction={'row'} spacing={0.1}>
                                                        <Button type="file" size="small" component="label"  > Upload Profile <VisuallyHiddenInput type="file" onInput={handleCapture} accept="image/png, image/jpeg" /> </Button>
                                                            {
                                                                 addUserData.profile?
                                                                 <IconButton size='small' color='error' onClick={()=>{
                                                                  setAddUserData({...addUserData, profile:''})
                                                                  }}>
                                                                <Delete fontSize='10px' />
                                                            </IconButton>
                                                            :null
                                    
                                                            }
                                                            
                                                        </Stack>
                                                    }
                                                    

                                                </Container>
                                                <Stack spacing={2}>
                                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required >First Name</InputLabel>
                                                            <OutlinedInput value={addUserData.firstName} onChange={handleUserDataChange} size="small" name="firstName" required={true} type={"text"} label="First Name" placeholder="enter first name" />
                                                        </FormControl>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required >Last Name</InputLabel>
                                                            <OutlinedInput value={addUserData.lastName} onChange={handleUserDataChange} size="small" name="lastName" required={true} type={"text"} label="Last Name" placeholder="enter last name" />
                                                        </FormControl>
                                                    </Stack>

                                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                                                            <DemoContainer components={['MobileDatePicker']} >

                                                                <FormControl required fullWidth variant="outlined">
                                                                    <MobileDatePicker

                                                                        label="DOB"
                                                                        slotProps={{ textField: { error: error, required: true, size: 'small', } }}
                                                                        format="DD/MM/YYYY"
                                                                        value={addUserData.dob ? dayjs(addUserData.dob) : null}

                                                                        onChange={e => {

                                                                            if (e) {
                                                                                //console.log(new Date().toISOString().slice(0, 10))
                                                                                //console.log((e.$d.toLocaleDateString('en-CA')))
                                                                                setError(false)
                                                                                setAddUserData({ ...addUserData, dob: e.$d.toLocaleDateString('en-CA') })
                                                                            }
                                                                        }}
                                                                    />

                                                                </FormControl>
                                                            </DemoContainer>

                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel sx={{ mt: 1 }} size="small" required >Country</InputLabel>
                                                                <Select sx={{ mt: 1, }} onChange={handleUserDataChange} name="country" defaultValue="India" required value={addUserData.country} size="small" label="Country" placeholder="select country">
                                                                    {
                                                                        countries.map((name, index) => <MenuItem key={index} value={name}>{name}</MenuItem>)
                                                                    }

                                                                </Select>
                                                            </FormControl>

                                                        </Stack>

                                                    </LocalizationProvider>

                                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required >Gender</InputLabel>
                                                            <Select value={addUserData.gender} onChange={handleUserDataChange} name="gender" size="small" required label="Gender">
                                                                <MenuItem value='male'>Male</MenuItem>
                                                                <MenuItem value='female'>Female</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small"  >Blood Group</InputLabel>
                                                            <Select value={addUserData.bloodGroup} onChange={handleUserDataChange} name="bloodGroup" size="small" label="Blood Group">
                                                                {
                                                                    ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((group, index) =>
                                                                        <MenuItem key={index} value={group}>{group}</MenuItem>
                                                                    )
                                                                }
                                                            </Select>
                                                        </FormControl>

                                                    </Stack>



                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Company Name</InputLabel>
                                                        <Select value={addUserData.companyName} onChange={handleUserDataChange} size="small" name="companyName" required={true} type={"text"} label="Company Name">
                                                            {
                                                                companyNames.map((name, index) => <MenuItem key={index} value={name.company_name}>{name.company_name}</MenuItem>)
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small"  >About Yourself</InputLabel>
                                                        <OutlinedInput value={addUserData.aboutYourself} onChange={handleUserDataChange} size="small" name="aboutYourself" multiline minRows={2} maxRows={2} type={"text"} label="About Yourself" placeholder="enter about yourself" />
                                                    </FormControl>
                                                </Stack>
                                            </Container>

                                            <Container >
                                                <Typography variant="p" component={'h5'} m={1} textAlign={'center'}>Login Details</Typography>
                                                <Stack spacing={2}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                                                            <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                                                <InputLabel size="small" required >Employee ID</InputLabel>
                                                                <OutlinedInput  startAdornment={<InputAdornment position="start">bcg/</InputAdornment>} name='employeeId' value={addUserData.employeeId} onChange={handleUserDataChange} size="small" required={true} type={"text"} label="Employee ID" />
                                                            </FormControl>
                                                            <FormControl fullWidth variant="outlined">
                                                                <MobileDatePicker
                                                                    label="Date Of Joining"
                                                                    format="DD/MM/YYYY"
                                                                    value={addUserData.dateOfJoining ? dayjs(addUserData.dateOfJoining) : dayjs()}
                                                                    slotProps={{ textField: { required: true, size: 'small', fullWidth: true } }}
                                                                    onChange={e => {

                                                                        if (e) {
                                                                            setAddUserData({ ...addUserData, dateOfJoining: e.$d.toLocaleDateString('en-CA') })
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>



                                                        </Stack>

                                                    </LocalizationProvider>
                                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                                        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                                            <InputLabel size="small" required >UserType</InputLabel>

                                                            <Select value={addUserData.userType} onChange={handleUserDataChange} size="small" label="UserType" name="userType" required>
                                                                <MenuItem value="user">User</MenuItem>
                                                                <MenuItem value="admin">Admin</MenuItem>


                                                            </Select>
                                                        </FormControl>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required >Department</InputLabel>
                                                            <Select size="small" label="Department" name="department" value={addUserData.department} onChange={handleUserDataChange} required>
                                                                <MenuItem value="management">Management</MenuItem>
                                                                <MenuItem value="software">Software</MenuItem>
                                                                <MenuItem value="ai labelling">AI Labelling</MenuItem>
                                                                <MenuItem value="accounts">Accounts</MenuItem>
                                                                <MenuItem value="hr">HR</MenuItem>
                                                                <MenuItem value="it">IT</MenuItem>

                                                            </Select>
                                                        </FormControl>
                                                    </Stack>

                                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required >Shift</InputLabel>
                                                            <Select name="shift" required size="small" label="Shift" value={addUserData.shift} onChange={handleUserDataChange}>
                                                                <MenuItem value={9}>9</MenuItem>
                                                                <MenuItem value={8}>8</MenuItem>


                                                            </Select>

                                                        </FormControl>

                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required >Status</InputLabel>
                                                            <Select onChange={handleUserDataChange} value={addUserData.status} name="status" required size="small" label="Status" placeholder="select country">
                                                                <MenuItem value="active">Active</MenuItem>
                                                                <MenuItem value="denied">Denied</MenuItem>
                                                                <MenuItem value="resign">Resign</MenuItem>

                                                            </Select>
                                                        </FormControl>
                                                    </Stack>

                                                    <Stack spacing={1.5}>



                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required>Email</InputLabel>
                                                            <OutlinedInput
                                                                value={addUserData.email}
                                                                onChange={handleUserDataChange}
                                                                size="small"
                                                                name="email"
                                                                required={true}
                                                                id="outlined-adornment-email"
                                                                type={'email'}
                                                                label="Email"
                                                            />
                                                        </FormControl>



                                                        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>

                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel size="small" required htmlFor="outlined-adornment-password">Password</InputLabel>
                                                                <OutlinedInput
                                                                    value={addUserData.password}
                                                                    name="password"
                                                                    onChange={handleUserDataChange}
                                                                    size="small"
                                                                    required={true}
                                                                    id="outlined-adornment-password"
                                                                    type={showPassword ? 'text' : 'password'}
                                                                    endAdornment={
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                aria-label="toggle password visibility"
                                                                                onClick={handleClickShowPassword}

                                                                                edge="end"
                                                                            >
                                                                                {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                    label="Password"
                                                                />
                                                            </FormControl>
                                                            <p style={{ fontSize: '12px', width: '250px' }}>generate password<IconButton onClick={() => handlePasswordGenerate()}><Cached color="info" fontSize="small" /></IconButton></p>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small"  >Past Exp Domain</InputLabel>
                                                            <OutlinedInput size="small" name="pastExpDomain" value={addUserData.pastExpDomain} onChange={handleUserDataChange} type={"text"} label="Past Exp Domain" />
                                                        </FormControl>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required >Past Exp Years</InputLabel>
                                                            <OutlinedInput size="small" name="pastExpYears" value={addUserData.pastExpYears} onChange={handleUserDataChange} required={true} type={"number"} inputProps={{ min:0, step: 0.1 }} label="Past Exp Years" />
                                                        </FormControl>

                                                    </Stack>



                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required >Designation</InputLabel>
                                                        <OutlinedInput value={addUserData.designation} onChange={handleUserDataChange} size="small" name="designation" required={true} type={"text"} label="Designation" />
                                                    </FormControl>

                                                </Stack>

                                            </Container >

                                        </Container>
                                        <Stack display={'flex'} justifyContent={'center'} direction={'row'} mt={0.8} spacing={{ xs: 4, lg: 4 }}>
                                            <Button size="small" variant="contained" color='success' type='submit' >ADD</Button>
                                            <Button size="small" variant="contained" color='error' onClick={() => handleUserDataClear()}  >Clear</Button>
                                        </Stack>
                                    </form>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>



        </>
    )

}

export default AddUser;


