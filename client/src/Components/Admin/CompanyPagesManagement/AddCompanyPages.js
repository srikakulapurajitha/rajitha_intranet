import NavBar from '../../Comman/NavBar/NavBar';
import { Box, Button, Collapse, Container,  FormControl, Grid,  IconButton,  InputLabel,  MenuItem, OutlinedInput, Paper, Select, Stack,  Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {  ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css' 
import { Add, Delete, Save } from '@mui/icons-material';
//import { convertDateFormat } from '../../utils';
import DataTable from 'react-data-table-component';


function AddCompanyPages() {
  const [companyPageData, setCompanyPageData] = useState({
    company_name:'',
    company_pagename:'',
    company_pagetype:'',
    company_pagestatus:'',
    companyId:''
  })
  const [companyNames, setCompanyNames] = useState([])

  const [addHolidays ,setAddHolidays] = useState({
    holidaylist_title:'',
    holiday_title:[],
    holiday_date:[],
    holiday_day:[]
    
  })
  const [holidayData,setHolidayData] = useState([])
 
  const [tempHolidayData , setTempHolidayData] = useState({
    tempholiday_title:'',
    tempholiday_date:'',
    tempholiday_day:''

  })

  const [pageTypeView,setPageTypeView] = useState(false)
  

  //making rows data

  useEffect(()=>{
    ////console.log('use called')
    const data = addHolidays.holiday_date.map((data,index)=>{
   // //console.log('updating', data,index,addHolidays)
    return(
      {
        id:index+1,
        title:addHolidays.holiday_title[index],
        date:data,
        day:addHolidays.holiday_day[index]

        
      }
    )
  })
  setHolidayData(data)
  },[addHolidays])


  //handling procced option

  const handleProccedToOption = (e) =>{
    e.preventDefault()
    //console.log(['Holidays','Chart','Address'].includes(companyPageData.company_pagetype))
    if(['Holidays','Chart','Address'].includes(companyPageData.company_pagetype) && companyPageData.company_name!=='' && companyPageData.company_pagename!=='' && companyPageData.company_pagestatus!==''){
      setPageTypeView(true)
    }
    
  }

  //rendering component according to pagetype

  const checkPageTypeView=()=>{
    if(companyPageData.company_pagetype==='Holidays'){
      return holidayOption
    }
    else if(companyPageData.company_pagetype==='Address'){
      return addressOption

    }
    else if(companyPageData.company_pagetype==='Chart'){
      return null
    }
    else{
      return null
    }
  }


  //creating address option

  const addressOption = useMemo(()=>{
    const handleConfirm = () =>{
      //console.log('clicked')
      if (companyPageData.company_name!=='' && companyPageData.company_pagename!=='' && companyPageData.company_pagetype !=='' && companyPageData.company_pagestatus!==''){
        let msg = ''
			  try {
          const result =toast.promise(
          axios.post('/api/addcompanypageaddress', companyPageData),
          {
						pending: {
							render() {
								return ('Adding CompanyPage Details')
							}
						},
						success: {
							render(res) {
                msg = (res.data.data)
                
                              
                
								
								return (`${msg} `)
							}
						},
						error: {
							render(err) {
                //console.log(err)
								return (`${err.data.response.data}`)
							}
						}
					}

				)
				msg = (result.data)
				//console.log(result.data)
			}
			catch (err) {
				msg = (err.response.data)

			} 
      }
      else{
        toast.error('Add data properly!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        
      }

    }
    return(
      <>
      <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  height: { xs: '60ch', md: '52ch',lg:'52ch' } }}>
        <Box  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  p: 1, }}>
          <Typography component={'h4'} variant='p'> Address data automatically saved from company management</Typography>
          <Button variant='outlined' color='success' onClick={()=>handleConfirm()} sx={{m:2}}>Confirm</Button>
        </Box>
      </Paper>
      </>
    )
  },[companyPageData])

 

  
  // creating holidaylist option 
  const holidayOption = useMemo(()=>{

    const columns = [
      {
          name: 'No.',
          selector: row => row.id,
          sortable: true,
          minWidth:'60px'
           
      },
      {
          name: 'Holiday title',
          selector: row => row.title,
          minWidth:'150px',
          center:true
          
      },
      {
        name: 'Date',
        selector: row => row.date,
        sortable: true,
        
        center:true
    },
    {
      name: 'Day',
      selector: row => row.day,
      
    },
    {
      minWidth:'10px',
      center:true,
      cell: (row) => <IconButton onClick={()=>handleDeleteHoliday(row)}><Delete/></IconButton>,
      ignoreRowClick: true,
      allowOverflow: true,
      
    },
    ];
  
  
    //deleting holiday list row
  
    const handleDeleteHoliday =(row)=>{
      ////console.log('from delete')
     
      const index = addHolidays.holiday_date.indexOf(row.date)
      ////console.log('h,i',addHolidays,index)
      addHolidays.holiday_title.splice(index,1)
      addHolidays.holiday_date.splice(index,1)
      addHolidays.holiday_day.splice(index,1)
  
      
      const filteredData = {
        ...addHolidays,
        
      }
      //console.log('filtered',filteredData)
      
      setAddHolidays(filteredData)
      //setInterval(()=>{//console.log(addHolidays)},5000)
      
  
    }
  
    // setting temp holiday data
  
    const handleHolidaysData = (e) =>{
      //console.log(e.target.value)
      if(e.target.name === 'holiday_date'){
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const holidayday = days[(new Date(e.target.value)).getDay()]
        setTempHolidayData({...tempHolidayData,tempholiday_date:e.target.value,tempholiday_day:holidayday})
      }
      else{
        setTempHolidayData({...tempHolidayData, tempholiday_title:e.target.value})
      }
      //console.log(addHolidays)
      
    }
  
    // on pressing + icon add temp to permently to list
  
    const addHolidaysData = (e) =>{
      //console.log('fromadd holiday')
      e.preventDefault()
      if(addHolidays.holiday_date.includes(tempHolidayData.tempholiday_date)){
        toast.error('Date already Exists!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      else{
        setAddHolidays({...addHolidays,holiday_title:[...addHolidays.holiday_title,tempHolidayData.tempholiday_title],holiday_date:[...addHolidays.holiday_date,tempHolidayData.tempholiday_date],holiday_day:[...addHolidays.holiday_day,tempHolidayData.tempholiday_day]})
        setTempHolidayData({
          tempholiday_title:'',
          tempholiday_date:'',
          tempholiday_day:'' 
        })
        toast.success('Data added!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
  
  
    }
  
    //deleteholidaytotal list
  
    const handleHolidayListRemove = () =>{
      setAddHolidays({
        holidaylist_title:'',
        holiday_title:[],
        holiday_date:[],
        holiday_day:[]
      })
      toast.warning('Holiday List Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      
    }
  
    //submiting total holiday list
  
    const handleHolidayListSubmit =(e)=>{
      e.preventDefault()
      
      if (companyPageData.company_name!=='' && companyPageData.company_pagename && companyPageData.company_pagetype !=='' && companyPageData.company_pagestatus!==''&&addHolidays.holidaylist_title!==''&&addHolidays.holiday_date.length!==0){
        let msg = ''
			  try {
          const result =toast.promise(
          axios.post('/api/addcompanypageholidays', {'companypagedata':companyPageData,'pagedetails':addHolidays}),
          {
						pending: {
							render() {
								return ('Adding CompanyPage Details')
							}
						},
						success: {
							render(res) {
                msg = (res.data.data)
                
                setCompanyPageData({
                  company_name:'',
                  company_pagename:'',
                  company_pagetype:'',
                  company_pagestatus:'',
                  companyId:''
                })
                setAddHolidays({
                  holidaylist_title:'',
                  holiday_title:[],
                  holiday_date:[],
                  holiday_day:[]
                })
                setPageTypeView(false)
								
								return (`${msg} `)
							}
						},
						error: {
							render(err) {
                //console.log(err)
								return (`${err.data.response.data}`)
							}
						}
					}

				)
				msg = (result.data)
				//console.log(result.data)
			}
			catch (err) {
				msg = (err.response.data)

			} 
      }
      else{
        toast.error('Add data properly!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        
      }
  
    }
    
    return(
      <>
      <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  height: { xs: '60ch', md: '52ch',lg:'52ch' } }}>
        <Box  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  p: 1, }}>
          <Stack component={'form'} onSubmit={handleHolidayListSubmit} direction={{xs:'column',md:'row'}} spacing={{xs:1,sm:1,md:2,lg:2}} sx={{mb: 2,borderBottom:'1px solid black' }} p={1} >
            <FormControl variant="outlined">
              <InputLabel htmlFor='holidaylisttitle' size='small' required >Holiday List Title</InputLabel>
              <OutlinedInput
                id='holidaylisttitle'
                name='holidaylist_title'
                value={addHolidays.holidaylist_title}
                required={true}
                type={'text'}
                label="Holiday List Title"
                placeholder='enter holidaylist title'
                size='small'
                onInput={e=>setAddHolidays({...addHolidays,holidaylist_title:e.target.value})}
                
              />
              </FormControl>
                  <Stack direction="row" spacing={1} p={0.5} >
                    <Button variant="outlined" color='error' size='small' onClick={handleHolidayListRemove} startIcon={<Delete />}>
                      Delete
                    </Button>
                    <Button variant="outlined" color='success' type='submit' size='small' endIcon={<Save />}>
                      Save
                    </Button>
                  </Stack>
                
                </Stack>
                <form id='addholidaylist' onSubmit={addHolidaysData}>
                  <Stack alignItems="center" direction={'row'} width={{lg:'52ch'}}>
                  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined" >
                    <InputLabel htmlFor='holidaytitle' required size={"small"} >Holiday Title</InputLabel>
                    <OutlinedInput
                      id='holidaytitle'
                      name='holiday_title'
                      required={true}
                      fullWidth
                      type={'text'}
                      label="Holiday Title"
                      placeholder='enter holiday title'
                      size='small'
                      value={tempHolidayData.tempholiday_title}
                      onChange={handleHolidaysData}

                    />
                  </FormControl>
                  </Stack>
                  <Stack  alignItems="center"  direction={{xs:'column',lg:'row'}} spacing={2} >
                  
                  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    
                    <OutlinedInput
                      name='holiday_date'
                      size='small'
                      required={true}
                      type={'date'}   
                      onChange={handleHolidaysData} 
                      value={tempHolidayData.tempholiday_date}                  

                    />
                  </FormControl>
                  
                  <FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel size='small'  required>Day</InputLabel>
                    <OutlinedInput
                      label="Day"
                      name="holiday_day"
                      type='text'
                      disabled
                      size='small'
                      required
                      value={tempHolidayData.tempholiday_day}

                    />
                     
                  </FormControl>
                  <IconButton form='addholidaylist'  type='submit' size='small'>
                    <Add fontSize='medium' color='success'  />
                  </IconButton>


                  </Stack>
                  
                  </form>
                  
                  <Container sx={{ display:'flex', flexDirection:'column',maxHeight:{xs:150,lg:200},width:"100%" }} >
                  <DataTable
                  
                  dense
                  subHeader
                  subHeaderComponent={<b>Holiday List</b>}
                  columns={columns}
                  data={holidayData}
                  fixedHeader
                  fixedHeaderScrollHeight='100%'
                                  

                  />
                  </Container>           

                </Box>
              </Paper>
      </>

    )
  },[addHolidays,holidayData,tempHolidayData,companyPageData])

  //taking companay names from db
  useEffect(()=>{
    axios.get('/api/companynames')
    .then(res=>{
      //console.log(res.data)
      setCompanyNames(res.data)
    })
  },[])
  
  const handleComPageData=(e)=>{
    //console.log(e.target.value)
    setCompanyPageData({...companyPageData,[e.target.name]:e.target.value})
  }
  const handleResetCompForm=()=>{
    //console.log(companyPageData)
    setCompanyPageData({
    company_name:'',
    company_pagename:'',
    company_pagetype:'',
    company_pagestatus:'',
    companyId:''
    })
    setPageTypeView(false)
  }

  
  return (
   <>
   <Box sx={{ display: 'flex' }}>
    <NavBar />
    <Box component='main' sx={{ flexGrow: 1, p: 3, mt:{xs:6,md:8,lg:6} }}>
      <div style={{  width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={{ xs: 2, md: 2,lg:2 }} m={1} style={{ display: 'flex' }}>
          <Grid item xs={12} sm={12} md={5} lg={5} >
            <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Add Company Pages</Typography>
            <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  height: { xs: '55ch', md: '52ch',lg:'52ch' } }}>  
                <Box component={'form'} onSubmit={handleProccedToOption}  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  p: 1, width:{xs:'30ch',lg:"45ch"} }}>
                <FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel  required>Company Name</InputLabel>
                    <Select
                      label="Company Name"
                      name="company_name"
                      value={companyPageData.company_name}
                      required
                      onChange={(e)=>{
                        const compId = companyNames.filter(c=>c.company_name===e.target.value)
                        ////console.log(compId[0].id)
                        ////console.log(e.target.value)
                        setCompanyPageData({...companyPageData,company_name:e.target.value,companyId:compId[0].id})
                        }}
                    >
                      {companyNames.map((name,index)=><MenuItem key={index} value={name.company_name}>{name.company_name}</MenuItem>)}
                      
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-comp_page_name">Company Page Name</InputLabel>
                    <OutlinedInput
                      name='company_pagename'
                      value={companyPageData.company_pagename}
                      required={true}
                      id="outlined-adornment-comp_page_name"
                      type={'text'}
                      label="Company Page Name"
                      placeholder='enter company page name'
                      onInput={handleComPageData}

                    />
                  </FormControl>
                  <FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel  required>Page Type</InputLabel>
                    <Select
                      label="Page Type"
                      name="company_pagetype"
                      value={companyPageData.company_pagetype}
                      required
                      onChange={handleComPageData}

                    >
                      <MenuItem value="Holidays">Holidays</MenuItem>
                      <MenuItem value="Address">Address</MenuItem>
                      <MenuItem value="Chart">Chart</MenuItem>
                    </Select>
                  </FormControl>

                  
                  <FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel  required>Page Status</InputLabel>
                    <Select
                      label="Page Status"
                      name="company_pagestatus"
                      value={companyPageData.company_pagestatus}
                      required
                      onChange={handleComPageData}

                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="denied">Denied</MenuItem>
                    </Select>
                  </FormControl>


                  <Stack spacing={5} direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="outlined" color='success' type='submit' >Proceed</Button>
                    <Button variant="outlined" color='error' onClick={handleResetCompForm} >Clear</Button>
                  </Stack>

                </Box>
              </Paper>
            </Grid>
            <Grid item xs={0} lg={0.5} md={1}>
              {/*spacing*/}
            </Grid>
            

            <Grid item xs={12} sm={12} lg={6} md={6} >
            <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Add Page Data</Typography>
              {
                pageTypeView?
                <>
                <Collapse in={pageTypeView} >
                <>
                {checkPageTypeView()}
                </>
                </Collapse>
                </>
                :null
              }
            </Grid>
        </Grid>
        </div>

    
  </Box>

  
   </Box>
   <ToastContainer />
   </>
  )
}

export default AddCompanyPages
