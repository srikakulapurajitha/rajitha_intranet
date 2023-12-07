import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/UserContext'
import AdminNavBar from '../NavBar/AdminNavBar'
import UserNavBar from '../NavBar/UserNavBar'
import axios from 'axios'
import { BadgeSharp, PersonSearch } from '@mui/icons-material'

//table
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



function DirectorySearch() {
    const [companyNames, setCompanyNames] = useState([])
    const [searchData, setSearchData] = useState({
        first_name:"",
        last_name: '',
        email: '',
        company_name : ''
    })
    const [loader, setLoader]= useState(false)
    const [userData, setUserData] = useState([])    
    const [selectedLetter, setSelectedLetter] = useState('');

    const { userDetails } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(()=>{
        const getCompanyNames = async()=>{
            try{
                const names = await axios.get('/api/companynames')
                setCompanyNames(names.data)
            }
            catch{

            }
        
        }
        getCompanyNames()
    },[])

    const handleSearchDataChange = (e)=>{
        const {name,value} = e.target
        setSearchData({...searchData, [name]:value})
    }

    const handleSearch = async(type,data)=>{
        if(type==='alphabet-search'){
            setSelectedLetter(data)
        }
        try{
            setLoader(true)
            const result = await axios.post('/api/searchuser',{searchType:type,data:data})
            setUserData(result.data)
            setLoader(false)

        }
        catch{
            setLoader(false)
        }

    }


   




    const handleSearchData = async (e) => {
        e.preventDefault()
        console.log(searchData)
        try{
            setLoader(true)
            const result = await axios.post('/api/searchuser',{searchType:'search-fileds',data:searchData})
            setUserData(result.data)
            setLoader(false)

        }
        catch{

            setLoader(false)
        }
        
    };

    
    const alphabet = Array.from({ length: 26 }, (_, index) => String.fromCharCode('A'.charCodeAt(0) + index));
    return (
        <Box sx={{ display: 'flex', backgroundColor: '#F5F5F5' }}>
            {userDetails.access === 'admin' ? <AdminNavBar /> : <UserNavBar />}
            <Box component='main' sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, height: '90vh', mt: 6 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Dictionary Search
                </Typography>
                <Grid spacing={3} container justifyContent="center" display={'flex'}>
                    <Grid item xs={12} lg={5}>
                        <Paper elevation={3} style={{ height: '100%' }}>
                            <Typography variant="p" component={'h4'} align="center" display={'flex'} justifyContent={'center'} alignItems={'center'} >
                                Search Options <PersonSearch sx={{ m: 0.2 }} fontSize='small' />
                            </Typography>
                            <Box p={1}>
                                <Grid container justifyContent="center">

                                    {alphabet.map((letter) => (
                                        <Grid item key={letter}>
                                            <button
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    fontSize: '10px',
                                                    margin: '2px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    textDecoration: 'none',
                                                    border: '1px solid gray',
                                                    //color: selectedLetter === letter ? 'white' : 'black', // Example styling for selected state
                                                    backgroundImage:selectedLetter === letter? 'linear-gradient(135deg, #abecd6 10%, #fbed96 100%)':'none',
                                                    backgroundColor: selectedLetter === letter ? 'none' : 'transparent', // Example styling for selected state
                                                    borderRadius: '4px', // Example border radius
                                                }}
                                                onClick={() => handleSearch('alphabet-search',letter)}

                                            >
                                                {letter}
                                            </button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                            <Box  sx={{ display: "flex", justifyContent: 'flex-end', mb: 0.5 }}>
                                <button
                                    style={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        marginRight: '20px',
                                        fontSize: '13px',
                                        color: "rgb(61, 115, 249  )",
                                        cursor: 'pointer',
                                        textDecoration: 'none',

                                    }}
                                    onClick={()=>handleSearch('view-all')}

                                >VIEW ALL
                                </button>

                            </Box>

                            <Container component={'form'} onSubmit={handleSearchData} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 'auto' }} >
                                <Stack mb={2} spacing={2} sx={{ display: 'flex', justifyContent: 'center', }}>
                                    <TextField
                                        label="First Name"
                                        size='small'
                                        fullWidth
                                        name='first_name'
                                        value={searchData.first_name}
                                        onChange={handleSearchDataChange}
                                    />
                                    <TextField

                                        size='small'
                                        label="Last Name"
                                        fullWidth
                                        name='last_name'
                                        value={searchData.last_name}
                                        onChange={handleSearchDataChange}
                                    />



                                    <TextField

                                        size='small'
                                        label="Email"
                                        fullWidth
                                        name='email'
                                        value={searchData.email}
                                        onChange={handleSearchDataChange}
                                    />



                                    <FormControl fullWidth variant='outlined'>
                                        <InputLabel size='small'>Select Company</InputLabel>
                                        <Select
                                            size='small'
                                            label="Select Company"
                                            name='company_name'
                                            value={searchData.company_name}
                                            onChange={handleSearchDataChange}
                                        >
                                            {
                                                companyNames.map((data,index)=>(
                                                    <MenuItem key={index} value={data.company_name}>{data.company_name}</MenuItem>
                                                ))
                                            }
                                            
                                        </Select>
                                    </FormControl>
                                    <Button variant="contained" color="info" type='submit' >
                                        Search
                                    </Button>


                                </Stack>





                            </Container>
                        </Paper>

                    </Grid>
                    <Grid item xs={12} sm={12} lg={7}>
                        <Paper elevation={3} style={{ height: '400px' }}>
                            <Typography variant="p" component={'h4'} align="center" display={'flex'} justifyContent={'center'} alignItems={'center'} gutterBottom >
                                Search Result <BadgeSharp sx={{ m: 0.2 }} fontSize='small' />
                            </Typography>
                            <Box height={'100%'} p={1}>

                                <DataTable size='small' resizableColumns scrollable loading={loader}  scrollHeight='350px' showGridlines value={userData} selectionMode="single" onSelectionChange={(e) => {
                                    console.log(e.value)
                                    userDetails.employee_id===e.value.employee_id?navigate('/myprofile'):
                                navigate(`/viewuserprofile/${e.value.employee_id}/info`,{relative:true})
                                    
                                }}
                                    dataKey="employee_id" tableStyle={{ minWidth: 'auto', fontSize:"12px" }}>
                                    <Column sortable field="fullname" header="Name"></Column>
                                    <Column field="email" header="Email"></Column>
                                    <Column field="company_name" header="Company Name"></Column>

                                </DataTable>


                            </Box>

                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>



    )
}

export default DirectorySearch
