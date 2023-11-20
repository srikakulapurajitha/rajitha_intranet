import React from 'react'
import NavBar from '../../Comman/NavBar/AdminNavBar';
import { Box, Card, Divider, Stack, Typography,Button, Drawer, Paper, List, ListItem, ListItemText, Container, DialogActions, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, OutlinedInput, Select, MenuItem, IconButton, TextField } from '@mui/material'
import DataTable, { defaultThemes } from 'react-data-table-component';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useMemo } from 'react';
import { Add, Delete, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import EditChartUpload from './EditChartUpload';
import Loader from '../../Comman/Loader';

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

function ViewCompanyPages() {
	const [companyNames, setCompanyNames] = useState([])
    const [companyPageData, setCompanyPageData] = useState([])
	const [filteredCompanyPages,setFilteredCompanyPages]=useState(companyPageData)
	const [selectedRows, setSelectedRows] = useState([]);
	const [toggleCleared, setToggleCleared] = useState(false);
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [viewCompanyPageData, setViewCompanyPageData] = useState({
		companyPageDetails:{
			company_name:'',
			company_pagename:'',
			company_pagetype:' ',
			company_pagestatus:'',
			id:''
		},
		companyPageData:[
			{holidaylist_title:''},
		]
	})
	const [editDialogOpen,setEditDialogOpen] = useState(false)
	const [editCompanyPageData, setEditCompanyPageData] = useState({
		companyPageDetails:{
			company_name:'',
			company_pagename:'',
			company_pagetype:'',
			company_pagestatus:'',
			id:''
		}
	})
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
	const [chartImage, setChartImage] = useState('')
	
	const [loader, setLoader] = useState(true)


    //column names creation
	const columns = [

		{
			name: 'Company Name',
			selector: row => row.company_name,
			sortable: true,
			center: true
		},
		{
			name: 'Company Page Name',
			selector: row => row.company_pagename,
			center: true
		},
        {
			name: 'Page Type',
			selector: row => row.company_pagetype,
			center: true
		},
		{
			name: 'Page Status',
			selector: row => row.company_pagestatus,
			center: true
		},
		{
			name: 'Action',
			cell: (row) => <Stack display={'flex'} spacing={1} direction={'row'} height={25}><Button variant='outlined' size='small' onClick={()=>handleEditButton(row)} >EDIT</Button> <Divider orientation="vertical" flexItem /><Button color='success' variant='outlined' size='small' onClick={()=>handleViewButton(row)} >View</Button></Stack>,
			ignoreRowClick: true,
			allowOverflow: true,
			center: true,
			minWidth: '200px'
		},
	];
    //taking company data from api
	useEffect(() => {
		axios.get('/api/viewcompanypages/')
			.then(res => {
				//console.log(res.data)
				setFilteredCompanyPages(res.data)
				setCompanyPageData(res.data)
				
				setLoader(false)
				//setFilteredCompany(res.data)
				
			})
			.catch(err => {
				//console.log(err)
				setLoader(false)
			})
	}, [editDialogOpen,toggleCleared])

	//taking company names from api

	useEffect(()=>{
		axios.get('/api/companynames')
		.then(res=>{
		  //console.log(res.data)
		  setCompanyNames(res.data)
		})
	  },[])


    //handling view button
	const handleViewButton = (row) => {
		setViewDrawerOpen(true)
		//console.log(row)
		// taking page data
		axios.post('/api/getcompanypagedata',row)
		.then(res=>{
			//console.log(res.data)
			setViewCompanyPageData({companyPageDetails:row,companyPageData:res.data})

		})
		//setViewCompanyPageData({companyPageDetails:row,companyPageData:data})

	}

    //company deatails

	const companyPageDataOption = useMemo(()=>{
		//console.log('details',viewCompanyPageData)
		
		switch(viewCompanyPageData.companyPageDetails.company_pagetype){
			case 'Holidays':
				const columns = [
					{
						name:'No.',
						selector:(row, index)=>index+1,
						minWidth:'0px',
						center:true


					},
				
					{
						name: 'Holiday title',
						selector: row => row.holiday_title,
						minWidth:'140px',
						center:true
						
					},
					{
					  name: 'Date',
					  selector: row => (new Date(row.holiday_date)).toLocaleString('en-CA').slice(0, 10),
					  sortable: true,
					  center:true,
					  
				  },
				  {
					name: 'Day',
					selector: row => (row.holiday_day).slice(0,3),
					center:true,
					minWidth:{xs:'80px'}
					
				  },
				]
				return (
				<>
				
				<Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '35ch', md: '50ch',lg:'50ch' }, height: { xs: '55ch', sm: '55ch', md: '55ch' } }}>

						<Typography  variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Company Page Data</Typography>
						<Typography variant='p' component={'h5'} >Title: {viewCompanyPageData.companyPageData[0].holidaylist_title}</Typography>
						<Container sx={{ display:'flex', flexDirection:'column',maxHeight:{xs:150,lg:200},width:"100%" }} >
                  <DataTable
                  
                  dense
                  subHeader
                  subHeaderComponent={<b>Holiday List</b>}
                  columns={columns}
                  data={viewCompanyPageData.companyPageData}
                  fixedHeader
                  fixedHeaderScrollHeight='100%'
                                  

                  />
                  </Container>  
					</Paper>
				</>
				)
			case 'Address':
				return(
					<Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '35ch',sm:'35ch', md: '35ch',lg:'50ch' }, height: { xs: '55ch', sm: '55ch', md: '55ch' } }}>
						<Typography  variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Company Page Data</Typography>
						<List sx={{ width: '100%', display: "flex", margin: 0, flexDirection: 'column' }}>
							
							<ListItem alignItems="flex-start" >

								<ListItemText

									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body1"
												color="text.primary"
												mr={0.5}
											>
												Company Name:
											</Typography>
											{viewCompanyPageData.companyPageData[0].company_name}
										</>
									}
								/>
							</ListItem>
														
							<ListItem alignItems="flex-start">
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body1"
												color="text.primary"
												mr={0.5}
											>
												Address:
											</Typography>
											{viewCompanyPageData.companyPageData[0].company_address}
										</>
									}
								/>
							</ListItem>
							<ListItem alignItems="flex-start">
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body1"
												color="text.primary"
												mr={0.5}
											>
												Contact No:
											</Typography>
											{viewCompanyPageData.companyPageData[0].company_contact_no}
										</>
									}
								/>
							</ListItem>
						</List>
					</Paper>
				)
			case 'Chart':
				return(
					<Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '35ch',sm:'35ch', md: '35ch',lg:'50ch' }, height: { xs: '55ch', sm: '55ch', md: '55ch' } }}>
						<Typography  variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Company Page Data</Typography>
						<Box sx={{height:200}}>
							<Container sx={{maxWidth:'25ch',height:200,display:'flex',justifyContent:'center',alignItems:'center'}}>
								<img style={{border:'1px solid gray',maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} src={viewCompanyPageData.companyPageData[0].chart_image} alt='chart' />
							</Container>

						</Box>
					</Paper>
				)
	
			default:
				return <></>

		
		}
		
	},[viewCompanyPageData])

	const companyPageDetailsView = useMemo(() => {
		const handleViewButtonDrawerToggleClosing = () => {
			setViewDrawerOpen(!viewDrawerOpen);
			setViewCompanyPageData({
				companyPageDetails:{
					company_name:'',
					company_pagename:'',
					company_pagetype:' ',
					company_pagestatus:'',
					id:''
				},
				companyPageData:[]
			})
		};
		
		return (
			<Drawer
				anchor={'right'}
				open={viewDrawerOpen}
				onClose={handleViewButtonDrawerToggleClosing}
				variant="temporary"
				sx={{
					width: {xs:300,lg:800},
					'& .MuiDrawer-paper': {
						width: {xs:300,lg:800},
						marginTop: 6
					}
				}}
			>
				<Container sx={{ height: '90vh', width: '100%', display: 'flex', flexDirection: {xs:'column',lg:'row'}, justifyContent:'space-between', alignItems: 'center' }}>
				<Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '35ch', md: '35ch' }, height: { xs: '55ch', sm: '55ch', md: '55ch' } }}>
						<Typography variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Company Page Details</Typography>

						<List sx={{ width: '100%', display: "flex", margin: 0, flexDirection: 'column' }}>
							<ListItem sx={{ display: 'flex', justifyContent: 'flex-end' }}>

								<ListItemText
								>
									<Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
										<Typography
											sx={{ display: 'inline' }}
											component="span"
											variant="body1"
											color="text.primary"

										><u>Status</u> :</Typography>
										{
											viewCompanyPageData.companyPageDetails.company_pagestatus === 'active' ?
												<>
													<Typography
														sx={{ color: 'green', m: 0.5 }}
														component="span"
														variant="body2"

													> {viewCompanyPageData.companyPageDetails.company_pagestatus}</Typography>
												</>
												:
												<>
													<Typography
														sx={{ m: 0.5, color: 'red' }}
														component="span"
														variant="body2"
													>{viewCompanyPageData.companyPageDetails.company_pagestatus}</Typography>
												</ >
										}
									</Container>
								</ListItemText>
							</ListItem>
							<ListItem alignItems="flex-start" >
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body1"
												color="text.primary"
												mr={0.5}
											>
												Name:
											</Typography>
											{viewCompanyPageData.companyPageDetails.company_name}
										</>
									}
								/>
							</ListItem>
							<ListItem alignItems="flex-start">
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body1"
												color="text.primary"
												mr={0.5}
											>
												Page Name:
											</Typography>
											{viewCompanyPageData.companyPageDetails.company_pagename}
										</>
									}
								/>
							</ListItem>

							<ListItem alignItems="flex-start">
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body1"
												color="text.primary"
												mr={0.5}
											>
												Page Type:
											</Typography>
											{viewCompanyPageData.companyPageDetails.company_pagetype}
										</>
									}
								/>
							</ListItem>
                            
						</List>
					</Paper>
                    {companyPageDataOption}
				</Container>
			</Drawer>
		)
	}, [viewDrawerOpen, viewCompanyPageData,  companyPageDataOption])
//-----------------------------------------------------------------------------------------------------

//---------------------------------------------------Edit-----------------------------------

	//rendering component according to pagetype
	

	const chartOption= useMemo(()=>{
		const handleChartImage=(img)=>{
			console.log('img',img)
			setChartImage(img)
		}
		return(
			<>
			<Paper elevation={1} sx={{ display:'flex',justifyContent: 'center', alignItems: 'center', width: { sm: '50ch', md: '50ch',lg:'60ch' }, height: {  md: '45ch' } }}>
			  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { sm: '45ch', lg: '55ch' }, height: { md: '45ch' }, p: 1 }}>
				<EditChartUpload image={chartImage} handleImage={handleChartImage}  />
			  </Box>
			</Paper>
			</>
		  )
	},[chartImage])

	//--------------------------address option--------------------------------------------
	const addressOption = useMemo(()=>{
		
		return(
		  <>
		  <Paper elevation={1} sx={{ display:'flex',justifyContent: 'center', alignItems: 'center', width: { sm: '50ch', md: '50ch',lg:'60ch' }, height: {  md: '45ch' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { sm: '45ch', lg: '55ch' }, height: { md: '45ch' }, p: 1 }}>
			  <Typography component={'h4'} variant='p'> Address data automatically saved from company management</Typography>
			</Box>
		  </Paper>
		  </>
		)
	  },[])

	  //------------------------------------------------Holiday Option---------------------------------------

	useEffect(()=>{
		//console.log('use called',holidayData)
		const data = addHolidays.holiday_date.map((data,index)=>{
	   //console.log('updating', data,index,addHolidays)
		return(
		  {
			id:index+1,
			holiday_title:addHolidays.holiday_title[index],
			holiday_date:data,
			holiday_day:addHolidays.holiday_day[index]
	
			
		  }
		)
	  })
	  setHolidayData(data)
	  },[addHolidays])
	
	 
	
	  
	  // creating holidaylist option 
	  const holidayOption = useMemo(()=>{
		//console.log('hey')
	
		

		const columns = [
			{
				name:'No.',
				selector:(row, index)=>index+1,
				minWidth:'0px',
				compact:true,
				center:true,


			},
		
			{
				name: 'Holiday title',
				selector: row => row.holiday_title,
				minWidth:'150px',
				center:true,
				compact:true
				
			},
			{
			  name: 'Date',
			  selector: row => (row.holiday_date),
			  sortable: true,
			  center:true,
			  compact:true
			  
		  },
		  {
			name: 'Day',
			selector: row => (<>{(row.holiday_day)} </>),
			compact:true,
			center:true,
			minWidth:{xs:'80px',}
			
		  },
		  {
			minWidth:'0px',
			center:true,
			compact:true,
			cell: (row) => <IconButton size='small' onClick={()=>handleDeleteHoliday(row)}><Delete fontSize='small'/></IconButton>,
			ignoreRowClick: true,
			allowOverflow: true,
			
		  },
		]
	  
	  
		//deleting holiday list row
	  
		const handleDeleteHoliday =(row)=>{
		  //console.log('from delete')
		 
		  const index = addHolidays.holiday_date.indexOf(row.date)
		  //console.log('h,i',addHolidays,index)
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
		
		return(
		  <>
		  <Paper elevation={1} sx={{ display:'flex',justifyContent: 'center', alignItems: 'center', width: { sm: '50ch', md: '50ch',lg:'60ch' }, height: {  md: '45ch' } }}>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { sm: '45ch', lg: '55ch' }, height: { md: '45ch' }, p: 1 }}>
			  <Stack  direction={{xs:'column',md:'row'}} spacing={{xs:2,sm:2,md:2,lg:2}} sx={{mb: 2,borderBottom:'1px solid black' }} p={1} >
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
					  
					
					</Stack>
					<form onSubmit={addHolidaysData} id='addholidaylist'  >
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
					  <IconButton form='addholidaylist'   type='submit' size='small'>
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
		
	  },[addHolidays,tempHolidayData,holidayData])

	//edit button
	const handleEditButton = (row) =>{
		//console.log('selected row:',row)
		setEditDialogOpen(true)
		
		if(row.company_pagetype==='Holidays'){
			setEditCompanyPageData({companyPageDetails:row})
			axios.post('/api/getcompanypagedata',row)
		.then(res=>{
			//console.log(res.data)
			//console.log('title',res.data.map(d=>d.holiday_title))
			
			setAddHolidays({
				pageId : res.data[0].pageId,
				prevHolidayListTitle:res.data[0].holidaylist_title, //checking for unique title for pageId
				holidaylist_title:res.data[0].holidaylist_title,
				holiday_title:res.data.map(d=>d.holiday_title),
				holiday_date:res.data.map(d=>(new Date(d.holiday_date)).toLocaleString('en-CA').slice(0,10)),
				holiday_day:res.data.map(d=>d.holiday_day)
			})
			
		})
		.catch()
		}
		else if(row.company_pagetype==='Chart'){
			axios.post('/api/getcompanypagedata',row)
			.then(res=>{
				console.log(res.data)
				
				setEditCompanyPageData({companyPageDetails:row,companyPageData:res.data[0]})
				setChartImage(res.data[0].chart_image)
			})
			.catch()
		}
		else{
			setEditCompanyPageData({companyPageDetails:row})
		}
		
		
	}
	//company edit view
	const companyPageEditView = useMemo(()=>{
		//console.log(editCompanyPageData.companyPageDetails.company_pagetype)
		const checkPageTypeView=()=>{
		
			//console.log('checked')
			if(editCompanyPageData.companyPageDetails.company_pagetype==='Holidays'){
				
			  return holidayOption
			}
			else if(editCompanyPageData.companyPageDetails.company_pagetype==='Address'){
			  return addressOption
		
			}
			else if(editCompanyPageData.companyPageDetails.company_pagetype==='Chart'){
			  return chartOption
			}
			else{
			  return null
			}
		  }
		const handleEditDialogClose = () =>{
			console.log('dilog clicked')
			setEditDialogOpen(false)
			
		}
		
			//console.log(editCompanyPageData)
			const handleEditForm = (e) =>{
				e.preventDefault()
				
				
				const compDetails = editCompanyPageData.companyPageDetails
				let method;
				if (compDetails.company_pagetype==='Holidays'&&addHolidays.holidaylist_title!==''&&addHolidays.holiday_date.length!==0){
					method=axios.put('/api/updatecompanypageholidays', {compDetails,editHolidays:addHolidays})	
				}
				else if (compDetails.company_pagetype==='Address'){
					method=axios.put('/api/updatecompanypageaddress', compDetails)	
				}
				else if (compDetails.company_pagetype==='Chart'){
					method=axios.put('/api/updatecompanypagechart', {compDetails,image:{prevImg:editCompanyPageData.companyPageData.chart_image,newImg:chartImage}})	
					
					console.log(chartImage)
				}
				else{
					toast.error('Enter Data Properly!', {
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
				
				if(compDetails.company_name!=='' && compDetails.company_pagename && compDetails.company_pagestatus!==''&&method)
				{
					//console.log('edit',editCompanyPageData)
					
					
					try {
					 toast.promise(method,
						{
							pending: {
								render() {
									return ('Updating company page data')
								}
							},
							success: {
								render(res) {
									handleEditDialogClose()
									return (`${res.data.data} `)
								}
							},
							error: {
								render(err) {
									//console.log(err)
									return (`${err.data.response.data}`)
								}
							}
						})
						//console.log(result.data)
						
						}
						catch (err) {
							
						}
				}
				else{
					toast.error('Enter Data Properly!', {
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
				//console.log(addHolidays,editCompanyPageData)
			}

			
		return(
			<>
			<Dialog
			open={editDialogOpen}
			onClose={handleEditDialogClose}
			maxWidth={'400'}			
			>
				<DialogTitle>Edit Company Page</DialogTitle>
				<DialogContent dividers={true}>
				
					<Container sx={{display:'flex',flexDirection:{xs:'column',lg:'row'}}} >
					
				<Paper elevation={1} sx={{ display:'flex',justifyContent: 'center', alignItems: 'center', width: { sm: '40ch', md: '40ch',lg:'40ch' }, height: { sm: '30ch', md: '45ch' } }}>
               
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { sm: '35ch', md: '35ch' }, height: { sm: '25ch', md: '45ch' }, p: 1 }}>
				<form id='editcompanypage'  onSubmit={handleEditForm}>
				<FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel  required>Company Name</InputLabel>
                    <Select
                      label="Company Name"
                      name="company_name"
                      value={editCompanyPageData.companyPageDetails.company_name}
                      required
					  onChange={(e)=>{
						const compId = companyNames.filter(c=>c.company_name===e.target.value)
						//console.log(compId[0].id)
						//console.log(e.target.value)
						setEditCompanyPageData({...editCompanyPageData,companyPageDetails:{...editCompanyPageData.companyPageDetails,company_name:e.target.value,companyId:compId[0].id}})

					  }
					}
                      
                    >
                      {companyNames.map((name,index)=><MenuItem key={index} value={name.company_name}>{name.company_name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-comp_page_name">Company Page Name</InputLabel>
                    <OutlinedInput
                      name='company_pagename'
                      value={editCompanyPageData.companyPageDetails.company_pagename}
                      required={true}
                      id="outlined-adornment-comp_page_name"
                      type={'text'}
                      label="Company Page Name"
                      placeholder='enter company page name'
					  onChange={(e)=>setEditCompanyPageData({...editCompanyPageData,companyPageDetails:{...editCompanyPageData.companyPageDetails,'company_pagename':e.target.value}})}                      

                    />
                  </FormControl>
                  <FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel  required>Page Type</InputLabel>
                    <OutlinedInput
                      label="Page Type"
                      name="company_pagetype"
					  disabled
                      value={editCompanyPageData.companyPageDetails.company_pagetype}
                      required
                      

                    />
                      
                  </FormControl>

                  
                  <FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel  required>Page Status</InputLabel>
                    <Select
                      label="Page Status"
                      name="company_pagestatus"
                      value={editCompanyPageData.companyPageDetails.company_pagestatus}
                      required
					  onChange={(e)=>setEditCompanyPageData({...editCompanyPageData,companyPageDetails:{...editCompanyPageData.companyPageDetails,'company_pagestatus':e.target.value}})}                      

                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="denied">Denied</MenuItem>
                    </Select>
                  </FormControl>                 
				  </form>
                </Box>
				
              </Paper>
			  {checkPageTypeView()}
			  
			  </Container>
			  
				</DialogContent>
				<DialogActions>
					<Button  color='error' onClick={handleEditDialogClose}>Cancel</Button>
					<Button  color='success' form='editcompanypage' type='submit' >Update</Button>
				</DialogActions>

			</Dialog>
			</>
		)
	},[editDialogOpen,editCompanyPageData,companyNames,holidayOption,addHolidays,addressOption,chartImage,chartOption])

	//row selection
	const handleRowSelected = React.useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

	// teble context
	const contextActions = React.useMemo(() => {
		const handleDelete = async () => {
			//console.log(selectedRows.map(details => details.id))
			let msg = ''
			try {
				const result = await toast.promise(
					axios.post(`/api/deletecompanypages/`, { id: selectedRows.map(details => details.id) }),
					{
						pending: {
							render() {
								return ('Deleting Company Pages')
							}
						},
						success: {
							render() {
								setToggleCleared(!toggleCleared)
								return (`${msg} `)
							}
						},
						error: {
							render() {
								return (`${msg}`)
							}
						}
					}

				)
				msg = (result.data)
				//console.log(result)
			}
			catch (err) {
				msg = (err.response.data)

			}
		}

		return (
			<Button size='medium' key="delete" variant='contained' color='error' onClick={handleDelete} startIcon={<Delete />}>
				Delete
			</Button>
		);
	}, [selectedRows, toggleCleared]);

	//table searchbar
	const subHeaderSearchbar = React.useMemo(() => {
		const handleSearch = (e) => {
			//console.log(e.target.value)
						
			const filteredData = companyPageData.filter(d => (d.company_pagename).toLowerCase().includes((e.target.value).toLowerCase()))
			
			setFilteredCompanyPages(filteredData)

		}

		return (
			<Box>
				<TextField variant='outlined' size='small' placeholder='search company page' onInput={handleSearch} InputProps={{ endAdornment: <Search /> }} />
			</Box>

		);
	}, [companyPageData]);

	


  return (
    <>
     <NavBar />   
     <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 8 } }}>
     <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Typography variant='h5' component={'h5'} m={2} textAlign={'center'} >View Company Pages</Typography>
					<div style={{ height: '400px', width: '95%' }}>
						<Card>
							<DataTable
								title=" "
								fixedHeader={true}
								fixedHeaderScrollHeight='250px'
								columns={columns}
								data={filteredCompanyPages}
								selectableRows
								contextActions={contextActions}
								onSelectedRowsChange={handleRowSelected}
								clearSelectedRows={toggleCleared}
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
     {companyPageDetailsView}
	 {companyPageEditView}
	 <Loader loader={loader} /> 
	 
	 
    </>
  )
}

export default ViewCompanyPages