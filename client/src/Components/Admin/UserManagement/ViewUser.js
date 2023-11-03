import React, { useEffect, useMemo, useState } from 'react'
import NavBar from '../../Comman/NavBar/AdminNavBar';
import { Button, Box, Card, Divider, Stack, TextField, Typography, Paper, Drawer, Container, Avatar, ListItem, ListItemText, DialogActions, FormControl, InputLabel, OutlinedInput, IconButton, InputAdornment, MenuItem, Select, DialogContent, DialogTitle, Dialog, Backdrop } from '@mui/material'
import DataTable, { defaultThemes } from 'react-data-table-component'
import axios from 'axios';
import { Search, Visibility, VisibilityOff } from '@mui/icons-material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import styled from 'styled-components';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { toast } from "react-toastify";



//table styling
const customStyles = {
    header: {
        style: {
            minHeight: '56px',
        },
    },

    headRow: {
        style: {

            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: defaultThemes.default.divider.default,
        },
    },
    headCells: {
        style: {
            fontSize: '14px',
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
    cells: {
        style: {
            '&:not(:last-of-type)': {

                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },

        },
    },
};

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

function ViewUser() {
    const [userData, setUserData] = useState([])
    const [filterUserData, setFilterUserData] = useState([])
    const [viewUserData, setViewUserData] = useState({})
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [editUserData, setEditUserData] = useState({})
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [companyNames, setCompanyNames] = useState([])
    const [error, setError] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(true)


    useEffect(() => {
        axios.get('/api/getuser')
            .then(res => {
                setUserData(res.data)
                setFilterUserData(res.data)
                setLoader(false)
            })
            .catch(()=>{
                toast.error('unable to fetch data try again!')
                setLoader(false)
            })
        axios.get('/api/companynames')
            .then(res=>{
            //console.log(res.data)
            setCompanyNames(res.data)
            })
    }, [editDialogOpen])



    //view user columns
    const columns = [

        {
            name: 'Emp_ID',
            selector: row => `bcg/${row.employee_id}`,
            sortable: true,
            center: true,
            maxWidth: '10px',
        },
        {
            name: 'User Name',
            selector: row => `${row.first_name} ${row.last_name}`,
            center: true,
            minWidth: '200px',
        },
        {
            name: 'Email',
            selector: row => row.email,
            center: true,
            minWidth: '250px',
            compact: true
        },
        {
            name: 'Access',
            selector: row => row.access,
            maxWidth: '50px',
            center: true,
            compact: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            maxWidth: '50px',
            center: true
        },
        {
            name: 'Action',
            cell: (row) => <Stack display={'flex'} spacing={1} direction={'row'} height={25}><Button variant='outlined' size='small' onClick={() => handleEditButton(row)} >EDIT</Button> <Divider orientation="vertical" flexItem /><Button color='success' variant='outlined' size='small' onClick={() => handleViewButton(row)} >View</Button></Stack>,
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
            minWidth: '200px'
        },
    ];

    //----------------------------------------------EDIT----------------------------------------------------------------------

    //edit button
    const handleEditButton = (row) => {
        //console.log(row)
        setEditUserData({...row,date_of_birth:new Date(row.date_of_birth).toLocaleDateString('en-CA'),date_of_joining: new Date(row.date_of_joining).toLocaleDateString('en-CA')})
        setEditDialogOpen(true)
    }

    // handle edituser

    const userEditDetails = useMemo(() => {

        const handleClickShowPassword = () => setShowPassword((show) => !show);

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
    
                        setEditUserData({...editUserData,profile_pic:url});
                    },
                    "image/jpeg",
                    0.8
                    );
                };
                };
            }
            else{
                setEditUserData({...editUserData,profile_pic:''})
            }
        }
        
    
        
    
        const countries = [
            "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
            "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
            "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
            "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)",
            "Costa Rica","Croatia","Cuba","Cyprus","Czechia","Côte d'Ivoire","Denmark","Djibouti","Dominica","Dominican Republic",
            "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland",
            "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
            "Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran",
            "Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati",
            "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania",
            "Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
            "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia",
            "Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
            "Oman","Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines",
            "Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",
            "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia",
            "Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname",
            "Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago",
            "Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay",
            "Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
        ];
    
    
        const handleUserDataChange=(e)=>{
            //console.log(e.target.name)
            setEditUserData({...editUserData,[e.target.name]:e.target.value})
        }



        const handleEditDialogClose = () => {
            
            setEditUserData({
                profile_pic:'',
                first_name:'', 
                last_name:'',
                date_of_birth:'',
                country:'',
                gender:'',
                blood_group:'',
                company_name:'',
                about_yourself:'',
                employee_id:'',
                access:'',
                date_of_joining:'',
                status:'',
                email:'',
                password:'',
                designation:''
            })
            setEditDialogOpen(false)
        }

        const handleEditSubmit = (e)=>{
            e.preventDefault()
            //console.log(editUserData)
            toast.promise(axios.put('/api/edituser',editUserData),{
                pending:{
                    render(){
                        return('Updating users details')
                    }
                },
                success:{
                    render(res){
                        handleEditDialogClose()
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
        

        return (
            <>
                <Dialog
                    open={editDialogOpen}
                    onClose={handleEditDialogClose}
                    maxWidth={'120ch'}
                    
                 
                >
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent dividers={true}>
                        <Paper elevation={5}  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '30ch', md: '45ch',lg:'100ch' }, height: { xs: '100%', md: '100%',lg:'52ch',  },p:1 }}>
                                <form id='usereditsubmit' onSubmit={handleEditSubmit}>
                                    <Container sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                    {editUserData.profile_pic?
                                    <Avatar src={editUserData.profile_pic} sx={{ width: 46, height: 46, }}  />:
                                    <Avatar  sx={{ width: 46, height: 46, }}  />
                                    }
                                    <Button onInput={handleCapture} type="file" size="small" component="label"  > Upload Profile <VisuallyHiddenInput  type="file" accept="image/png, image/jpeg" /> </Button>

                                    </Container>
      
                                <Container sx={{display:'flex',flexDirection:{xs:'column',lg:'row'}, justifyContent:'center'}}>
                                    <Container sx={{borderRight:{xs:'none',lg:'1px solid black'} ,borderBottom:{xs:'1px solid black',lg:'none'}}}>
                                        <Typography variant="p" component={'h5'} m={1} textAlign={'center'}>Personal Details</Typography>
                                        <Stack spacing={2}>
                                        <Stack  direction={{xs:'column',md:'row'}} spacing={{xs:1,sm:1,md:2,lg:2}}   >
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel size="small" required >First Name</InputLabel>
                                                <OutlinedInput value={editUserData.first_name} onChange={handleUserDataChange} size="small" name="first_name" required={true} type={"text"} label="First Name" placeholder="enter first name" />      
                                            </FormControl>
                                            <FormControl fullWidth  variant="outlined">
                                                <InputLabel size="small" required >Last Name</InputLabel>
                                                <OutlinedInput value={editUserData.last_name} onChange={handleUserDataChange} size="small" name="last_name" required={true} type={"text"} label="Last Name" placeholder="enter last name" />      
                                            </FormControl>                                 
                                        </Stack>

                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <Stack  direction={{xs:'column',md:'row'}} spacing={{xs:1,sm:1,md:2,lg:2}}   >
                                            <DemoContainer   components={['MobileDatePicker']} >
                                            
                                                <FormControl required fullWidth variant="outlined">
                                                <MobileDatePicker
                                                    
                                                    label="DOB"
                                                    slotProps={{ textField: {error:error, required:true,size: 'small',}}}
                                                    format="DD/MM/YYYY"
                                                    value={dayjs(editUserData.date_of_birth)}
                                                    
                                                    onChange={e=>{
                                                       
                                                        if(e){
                                                            //console.log(new Date().toISOString().slice(0, 10))
                                                            //console.log((e.$d.toLocaleDateString('en-CA')))
                                                            setError(false)
                                                            setEditUserData({...editUserData,date_of_birth:e.$d.toLocaleDateString('en-CA')})
                                                        }
                                                    }}
                                                />

                                                </FormControl>
                                                </DemoContainer>
                                                    
                                                <FormControl fullWidth   variant="outlined">
                                                    <InputLabel sx={{mt:1}} size="small" required >Country</InputLabel>
                                                    <Select sx={{mt:1,}} onChange={handleUserDataChange} name="country" required value={editUserData.country}  size="small"  label="Country" placeholder="select country">
                                                        {
                                                            countries.map((name,index)=><MenuItem key={index} value={name}>{name}</MenuItem>)
                                                        }
                                                        
                                                    </Select>
                                                </FormControl> 
                                                
                                            </Stack>
                                            
                                        </LocalizationProvider>

                                        <Stack  direction={{xs:'column',md:'row'}} spacing={{xs:2,sm:1,md:2,lg:2}}  >
                                            <FormControl fullWidth  variant="outlined">
                                                <InputLabel size="small" required >Gender</InputLabel>
                                                <Select value={editUserData.gender} onChange={handleUserDataChange} name="gender" size="small" required label="Gender">
                                                    <MenuItem value='male'>Male</MenuItem>
                                                    <MenuItem value='female'>Female</MenuItem>   
                                                </Select>
                                            </FormControl>
                                            <FormControl fullWidth  variant="outlined">
                                                <InputLabel size="small"  >Blood Group</InputLabel>
                                                <Select value={editUserData.blood_group} onChange={handleUserDataChange} name="blood_group" size="small"  label="Blood Group">
                                                    {
                                                        ['A+','B+','O+','AB+','A-','B-','O-','AB-'].map((group,index)=>
                                                            <MenuItem key={index} value={group}>{group}</MenuItem>
                                                        )
                                                    }
                                                </Select>
                                            </FormControl>                                 

                                        </Stack>

                                        
                                        
                                        <FormControl fullWidth variant="outlined">
                                        <InputLabel size="small" required >Company Name</InputLabel>
                                        <Select value={editUserData.company_name} onChange={handleUserDataChange}   size="small" name="company_name" required={true} type={"text"} label="Company Name">
                                            {
                                                companyNames.map((name,index)=><MenuItem key={index} value={name.company_name}>{name.company_name}</MenuItem>)
                                            }
                                        </Select> 
                                        </FormControl>
                                        <FormControl fullWidth variant="outlined">
                                                <InputLabel size="small"  >About Yourself</InputLabel>
                                                <OutlinedInput value={editUserData.about_yourself} onChange={handleUserDataChange} size="small" name="about_yourself" multiline minRows={2} maxRows={2} type={"text"} label="About Yourself" placeholder="enter about yourself" />      
                                        </FormControl>
                                        </Stack>
                                    </Container>

                                    <Container >
                                    <Typography variant="p" component={'h5'} m={1} textAlign={'center'}>Login Details</Typography>
                                    <Stack spacing={2}>
                                    <Stack   direction={{xs:'column',md:'row'}} spacing={{xs:2,sm:1,md:2,lg:2}}  >
                                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                        <InputLabel size="small" required >Employee ID</InputLabel>
                                        <OutlinedInput startAdornment={<InputAdornment position="start">bcg/</InputAdornment>} value={editUserData.employee_id} onChange={handleUserDataChange}  size="small" name="employee_id" required={true} type={"text"}  label="Employee ID"  />      
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                                        <InputLabel size="small" required >Access</InputLabel>
                            
                                        <Select value={editUserData.access} onChange={handleUserDataChange} size="small" label="Access" name="access" required>
                                            <MenuItem value="user">User</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="hr">HR</MenuItem>
                                            <MenuItem value="manager">Manager</MenuItem>
                                            <MenuItem value="team lead"> Team Lead</MenuItem>
                                        </Select>
                                    </FormControl>                                   

                                    </Stack>
                                    <Stack  spacing={2}>

                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            
                                            <Stack  direction={{xs:'column',md:'row'}} spacing={{xs:1,sm:1,md:2,lg:2}}   >
                                            <DemoContainer    components={['MobileDatePicker']} >
                                            <FormControl fullWidth  variant="outlined">
                                                <MobileDatePicker
                                                    label="Date Of Joining"
                                                    format="DD/MM/YYYY"
                                                    value={dayjs(editUserData.date_of_joining)}
                                                    slotProps={{ textField: { required:true, size: 'small',fullWidth:true}   }}
                                                    onChange={e=>{
                                                       
                                                        if(e){
                                                            setEditUserData({...editUserData,date_of_joining:e.$d.toLocaleDateString('en-CA')})
                                                        }
                                                    }}
                                                />
                                                </FormControl>
                                                </DemoContainer>
                                                    
                                                <FormControl fullWidth  variant="outlined">
                                                    <InputLabel  sx={{mt:1}} size="small" required >Status</InputLabel>
                                                    <Select sx={{mt:1}} onChange={handleUserDataChange} value={editUserData.status}   name="status" required  size="small" label="Status" placeholder="select country">
                                                        <MenuItem value="active">Active</MenuItem>
                                                        <MenuItem value="denied">Denied</MenuItem>
                                                        <MenuItem value="resign">Resign</MenuItem>
                         
                                                    </Select>
                                                </FormControl> 
                                                
                                            </Stack>
                                            
                                        </LocalizationProvider>
                                    
                                        <FormControl  fullWidth  variant="outlined">
                                            <InputLabel size="small" required>Email</InputLabel>
                                            <OutlinedInput
                                            value={editUserData.email}
                                            onChange={handleUserDataChange}
                                            size="small"
                                            name="email"
                                            required={true}
                                            id="outlined-adornment-email"
                                            type={'email'}
                                            label="Email"
                                            />
                                        </FormControl>

                                        

                                        <Stack direction={{xs:'column',lg:'row'}} spacing={2}>
                                    
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel size="small" required htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                            disabled
                                            value={editUserData.password}
                                            name="password"
                                            onChange={handleUserDataChange}
                                            size="small"
                                            required={true}
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                disabled
                                                    aria-label="toggle password visibility"
                                                    onClick={()=>handleClickShowPassword()}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility fontSize="small"/>:<VisibilityOff fontSize="small" />  }
                                                </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            />
                                        </FormControl>
                                            
                                        </Stack>
                                        </Stack>

                                        <FormControl fullWidth variant="outlined">
                                        <InputLabel size="small" required >Designation</InputLabel>
                                        <OutlinedInput value={editUserData.designation} onChange={handleUserDataChange}   size="small" name="designation" required={true} type={"text"} label="Designation"  /> 
                                        </FormControl>
                                        
                                        </Stack>
                                
                                     </Container >
                        
                                </Container>
                                
                                </form>
                            </Paper>
                    </DialogContent>

                    <DialogActions>
                        <Button color='error' onClick={handleEditDialogClose}>Cancel</Button>
                        <Button color='success' type='submit' form='usereditsubmit' >Update</Button>
                    </DialogActions>

                </Dialog>

            </>
        )

    }, [editDialogOpen,editUserData,companyNames,showPassword,error])

    //-----------------------------------------------EDIT--------------------------------------------------------------------

    //-----------------------------------------------VIEW-----------------------------------------------------------
    //view button
    const handleViewButton = (row) => {
        //console.log(row)
        setViewUserData(row)
        setViewDrawerOpen(true)
    }

    //handle userdetailsview

    const userDetailsView = useMemo(() => {
        const handleViewButtonDrawerToggleClosing = () => {
            setViewUserData({})
            setViewDrawerOpen(false);

        };

        return (
            <>
                <Drawer
                    anchor={'right'}
                    open={viewDrawerOpen}
                    onClose={handleViewButtonDrawerToggleClosing}
                    variant="temporary"
                    sx={{
                        width: { xs: 350, lg: 800 },
                        '& .MuiDrawer-paper': {
                            width: { xs: 350, lg: 800 },
                            marginTop: 6
                        }
                    }}
                >
                    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '40ch', md: '45ch', lg: '100ch' }, height: { xs: '100%', md: '52ch', lg: '52ch', }, p: 1 }}>

                            <Typography variant='h5' component={'h5'} m={1} p={1}  >User Details</Typography>
                            <Container sx={{m:2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                {viewUserData.profile_pic ?
                                    <Avatar src={viewUserData.profile_pic} sx={{ width: 86, height: 86, }} /> :
                                    <Avatar sx={{ width: 86, height: 86, }} />
                                }
                            </Container>

                            <Container sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center' }}>
                                <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' }, borderBottom: { xs: '1px solid black', lg: 'none' } }}>
                                    <Typography variant="p" component={'h5'} border={'1px solid black'} m={1} textAlign={'center'}>Personal Details</Typography>

                                    <ListItem alignItems="flex-start" >
                                        <ListItemText
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                        mr={0.5}
                                                    >
                                                        User Name:
                                                    </Typography>
                                                    {`${viewUserData.first_name} ${viewUserData.last_name}`}
                                                </>
                                            }
                                        />
                                    </ListItem>

                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{  md: 2, lg: 2 }}>
                                        <ListItem alignItems="flex-start" >
                                            <ListItemText
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            mr={0.5}
                                                        >
                                                            DOB:
                                                        </Typography>
                                                        {new Date(viewUserData.date_of_birth).toLocaleDateString('en-CA')}
                                                    </>
                                                }
                                            />
                                        </ListItem>

                                        <ListItem alignItems="flex-start" >
                                            <ListItemText
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            mr={0.5}
                                                        >
                                                            Country:
                                                        </Typography>
                                                        {viewUserData.country}
                                                    </>
                                                }
                                            />
                                        </ListItem>

                                    </Stack>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ md: 2, lg: 2 }}>
                                        <ListItem alignItems="flex-start" >
                                            <ListItemText
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            mr={0.5}
                                                        >
                                                            Gender:
                                                        </Typography>
                                                        {viewUserData.gender}
                                                    </>
                                                }
                                            />
                                        </ListItem>

                                        <ListItem alignItems="flex-start" >
                                            <ListItemText
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            mr={0.5}
                                                        >
                                                            Blood Group:
                                                        </Typography>
                                                        {viewUserData.blood_group}
                                                    </>
                                                }
                                            />
                                        </ListItem>

                                    </Stack>
                                    <ListItem alignItems="flex-start" >
                                        <ListItemText
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                        mr={0.5}
                                                    >
                                                        Company Name:
                                                    </Typography>
                                                    {viewUserData.company_name}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <ListItem alignItems="flex-start" >
                                        <ListItemText
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                        mr={0.5}
                                                    >
                                                        About User:
                                                    </Typography>
                                                    {viewUserData.about_yourself}
                                                </>
                                            }
                                        />
                                    </ListItem>




                                </Container >
                                <Container >
                                    <Typography variant="p" component={'h5'} m={1} border={'1px solid black'} textAlign={'center'}>Login Details</Typography>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ md: 2, lg: 2 }}>
                                        <ListItem alignItems="flex-start" >
                                            <ListItemText
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            mr={0.5}
                                                        >
                                                            Employee ID:
                                                        </Typography>
                                                        {`bcg/${viewUserData.employee_id}`}
                                                    </>
                                                }
                                            />
                                        </ListItem>

                                        <ListItem alignItems="flex-start" >
                                            <ListItemText
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            mr={0.5}
                                                        >
                                                            Access:
                                                        </Typography>
                                                        {viewUserData.access}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    </Stack>

                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ md: 2, lg: 2 }}>
                                        <ListItem alignItems="flex-start" >
                                            <ListItemText
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                            mr={0.5}
                                                        >
                                                            Joinied:
                                                        </Typography>
                                                        {new Date(viewUserData.date_of_joining).toLocaleDateString('en-CA')}
                                                    </>
                                                }
                                            />
                                        </ListItem>

                                        <ListItem alignItems="flex-start" >

                                            <ListItemText>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"

                                                ><u>Status</u> :</Typography>
                                                {
                                                    viewUserData.status === 'active' ?
                                                        <>
                                                            <Typography
                                                                sx={{ color: 'green', m: 0.5 }}
                                                                component="span"
                                                                variant="body2"

                                                            > {viewUserData.status}</Typography>
                                                        </>
                                                        :
                                                        <>
                                                            <Typography
                                                                sx={{ m: 0.5, color: 'red' }}
                                                                component="span"
                                                                variant="body2"
                                                            >{viewUserData.status}</Typography>
                                                        </ >
                                                }

                                            </ListItemText>
                                        </ListItem>
                                    </Stack>

                                    <ListItem alignItems="flex-start" >
                                        <ListItemText
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                        mr={0.5}
                                                    >
                                                        Email:
                                                    </Typography>
                                                    {viewUserData.email}
                                                </>
                                            }
                                        />
                                    </ListItem>

                                    
                                    <ListItem alignItems="flex-start" >
                                        <ListItemText
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                        mr={0.5}
                                                    >
                                                        Designation:
                                                    </Typography>
                                                    {viewUserData.designation}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                </Container>
                            </Container>
                        </Paper>
                    </div>
                </Drawer>
            </>
        )
    }, [viewDrawerOpen, viewUserData])
    //----------------------------------------------------VIEW-------------------------------------------------------------------------------



    const subHeaderSearchbar = useMemo(() => {
        const handleSearch = (e) => {
            //console.log(e.target.value)

            const filteredData = userData.filter(d => (d.email).includes((e.target.value).toLowerCase()))

            setFilterUserData(filteredData)

        }

        return (
            <Box>
                <TextField variant='outlined' size='small' placeholder='search email' onInput={handleSearch} InputProps={{ endAdornment: <Search /> }} />
            </Box>

        );
    }, [userData]);
    return (
        <>
            <NavBar />
            <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs:8 } }}>
                <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant='h5' component={'h5'} m={2} textAlign={'center'} >View Users</Typography>
                    <div style={{ height: '400px', width: '95%' }}>
                        <Card>
                            <DataTable
                                title=" "
                                fixedHeader={true}
                                fixedHeaderScrollHeight='250px'
                                columns={columns}
                                data={filterUserData}
                                pagination
                                dense
                                subHeader
                                subHeaderComponent={subHeaderSearchbar}
                                customStyles={customStyles}
                            />
                        </Card>
                    </div>
                </div>
            </Box>
            {userDetailsView}
            {userEditDetails} 
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
            >
                <img src='gif2.gif' alt='loader' style={{ mixBlendMode: 'lighten' }} />
            </Backdrop>
        </>
    )
}

export default ViewUser