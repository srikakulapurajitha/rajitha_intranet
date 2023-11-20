import React, {  useEffect, useState } from 'react'
import { Avatar, Button, Container, FormControl,  InputLabel, MenuItem, OutlinedInput, Select, Stack,Typography } from '@mui/material'
import styled from 'styled-components'

import { toast } from 'react-toastify';
import axios from 'axios';


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

function PersonalInfo(props) {
    const {userDetails,handleUserDetails} =props
    const [userData,setUserData]= useState({
        profile_pic:userDetails.profile_pic?userDetails.profile_pic:'',
        first_name:userDetails.first_name?userDetails.first_name:'',
        last_name:userDetails.last_name?userDetails.last_name:'',
        email:userDetails.email?userDetails.email:'',
        company_name:userDetails.company_name?userDetails.company_name:'',
        designation:userDetails.designation?userDetails.designation:'',
        gender:userDetails.gender?userDetails.gender:'',
        date_of_birth:userDetails.date_of_birth?new Date(userDetails.date_of_birth).toLocaleString('en-CA').slice(0,10):'',
        country:userDetails.country?userDetails.country:'',
        about_yourself:userDetails.about_yourself?userDetails.about_yourself:''
    })
    
    
    useEffect(()=>{
        setUserData(
            {
                profile_pic:userDetails.profile_pic,
                first_name:userDetails.first_name,
                last_name:userDetails.last_name,
                email:userDetails.email,
                company_name:userDetails.company_name,
                designation:userDetails.designation,
                gender:userDetails.gender,
                date_of_birth:userDetails.date_of_birth?new Date(userDetails.date_of_birth).toLocaleString('en-CA').slice(0,10):'',
                country:userDetails.country,
                about_yourself:userDetails.about_yourself
            }
        )

    },[userDetails])




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
    const handleUserDataChange = (e) =>{
        const{name,value} = e.target
        setUserData({...userData,[name]:value})

    }

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
        if(file!==undefined){
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
                async(blob) => {
                    const file = new File([blob], imgname, {
                    type: "image/png",
                    lastModified: Date.now(),
                    });

                    //console.log(file);
                    const url = await convertBase64(file)
                    //console.log('base64', url )

                    setUserData({...userData,profile_pic:url});
                },
                "image/jpeg",
                0.8
                );
            };
            };
        }
        else{
            setUserData({...userData,profile_pic:''});
        }
    }
    const handleUpdateProfile =(e)=>{
        e.preventDefault()
        console.log({...userDetails,...userData})
        toast.promise(
            axios.post(`/api/updatepersonalinfo`, {...userData,emp_id:userDetails.employee_id}),
            {
                pending: {
                    render() {
                        return('updating personal info');
                    },
                },
                success: {
                    render(res) {
                        //setToggleCleared(!toggleCleared);
                        handleUserDetails({...userDetails,...userData})
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
    return (
        <>
            <form onSubmit={handleUpdateProfile}>
                <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {
                        userData.profile_pic?<Avatar src={userData.profile_pic} sx={{ width: 46, height: 46, }} />:<Avatar sx={{ width: 46, height: 46, }} />
                    }
                    <Button type="file" size="small" component="label"  > Upload Profile <VisuallyHiddenInput type="file" onInput={handleCapture} accept="image/png, image/jpeg" /> </Button>

                </Container>

                <Container sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center' }}>
                    <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' }, borderBottom: { xs: '1px solid black', lg: 'none' } }}>
                        <Typography variant="p" component={'h5'} mb={2} textAlign={'center'}>Company Information</Typography>
                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small" required >First Name</InputLabel>
                                    <OutlinedInput size="small" name="first_name" value={userData.first_name} onChange={handleUserDataChange}  required={true} type={"text"} label="First Name" placeholder="enter first name" />
                                </FormControl>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small" required >Last Name</InputLabel>
                                    <OutlinedInput size="small" name="last_name" value={userData.last_name} onChange={handleUserDataChange} required={true} type={"text"} label="Last Name" placeholder="enter last name" />
                                </FormControl>
                            </Stack>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel size="small" required>Email</InputLabel>
                                <OutlinedInput
                                    size="small"
                                    name="email"
                                    required={true}
                                    type={'email'}
                                    label="Email"
                                    value={userData.email}
                                    disabled
                                />
                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel size="small" required >Company Name</InputLabel>
                                <OutlinedInput
                                    size="small"
                                    name="companyName"
                                    disabled
                                    type={'text'}
                                    label="Company Name"
                                    value={userData.company_name}
                                />

                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel size="small" required >Designation</InputLabel>
                                <OutlinedInput size="small" name="designation" value={userData.designation} onChange={handleUserDataChange} required={true} type={"text"} label="Designation" />
                            </FormControl>

                        </Stack>
                    </Container>

                    <Container >
                        <Typography variant="p" component={'h5'}  mb={2} textAlign={'center'}>Personal Information</Typography>

                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small" required >Gender</InputLabel>
                                    <Select name="gender" size="small" value={userData.gender} onChange={handleUserDataChange} required label="Gender">
                                        <MenuItem value='male'>Male</MenuItem>
                                        <MenuItem value='female'>Female</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small" required >Date of Birth</InputLabel>
                                    <OutlinedInput size="small" value={userData.date_of_birth} disabled name="Date of Birth" required={true} type={"text"} label="Date of Birth" />
                                </FormControl>

                            </Stack>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel sx={{ mt: 1 }} size="small" required >Country</InputLabel>
                                <Select sx={{ mt: 1, }} value={userData.country} name='country' onChange={handleUserDataChange} required size="small" label="Country" placeholder="select country">
                                    {
                                        countries.map((name, index) => <MenuItem key={index} value={name}>{name}</MenuItem>)
                                    }

                                </Select>
                            </FormControl>

                            <FormControl fullWidth variant="outlined">
                                <InputLabel size="small"  >About Yourself</InputLabel>
                                <OutlinedInput size="small" value={userData.about_yourself} onChange={handleUserDataChange} name="about_yourself" multiline minRows={3} maxRows={3} type={"text"} label="About Yourself" placeholder="enter about yourself" />
                            </FormControl>



                        </Stack>

                    </Container >


                </Container>
                <Stack display={'flex'} justifyContent={'center'} direction={'row'} mt={0.8} >
                    <Button size="small" variant="contained" color='success' type='submit' >Update Profile</Button>
                </Stack>

            </form>
        </>
    )
}

export default PersonalInfo