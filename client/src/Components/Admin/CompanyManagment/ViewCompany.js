// referenece: 1.https://www.npmjs.com/package/react-data-table-ViewCompany 2.https://react-data-table-ViewCompany.netlify.app/


import { Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { defaultThemes } from 'react-data-table-component';
import NavBar from '../../Comman/NavBar/AdminNavBar';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';
import { useMemo } from 'react';

import phone from 'phone';
import Loader from '../../Comman/Loader';




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
const ViewCompany = () => {
	const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
	const [data, setData] = React.useState([]);
	const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [filteredCompany, setFilteredCompany] = useState(data)
	const [viewCompData, setViewCompData] = useState({})
	const [editCompData, setEditCompData] = useState({
		company_name:'',
		company_email:'',
		company_address:'',
		company_contact_no:'',
		company_status:''
	})
	const [loader, setLoader] = useState(true)
	const [noError, setNoError] = useState(false)
	const [prevData, setPrevData] = useState(editCompData)
 


	//column names creation
	const columns = [

		{
			name: 'Company Name',
			selector: row => row.company_name,
			sortable: true,
			center: true
		},
		{
			name: 'Company Email',
			selector: row => row.company_email,
			center: true
		},
		{
			name: 'Status',
			selector: row => row.company_status,
			center: true
		},
		{
			name: 'Action',
			cell: (row) => <Stack display={'flex'} spacing={1} direction={'row'} height={25}><Button variant='outlined' size='small' onClick={()=>handleEditButton(row)} >EDIT</Button> <Divider orientation="vertical" flexItem /><Button color='success' variant='outlined' size='small' onClick={() => handleViewButton(row)}>View</Button></Stack>,
			ignoreRowClick: true,
			allowOverflow: true,
			center: true,
			minWidth: '200px'
		},
	];

	//taking company data from api
	useEffect(() => {
		axios.get('/api/viewcompanys/')
			.then(res => {
				//console.log(res)
				setData(res.data)
				setFilteredCompany(res.data)
				setLoader(false)
			})
			.catch(err => {
				console.log(err)
				setLoader(false)
			})
	}, [toggleCleared,editDialogOpen])



	//handling view button
	const handleViewButton = (row) => {
		setViewDrawerOpen(true)
		//console.log(row)
		setViewCompData(row)

	}

	//company deatails

	const compDetailView = useMemo(() => {
		const handleViewButtonDrawerToggleClosing = () => {
			setViewDrawerOpen(!viewDrawerOpen);
			setViewCompData({})
		};

		return (
			<Drawer
				anchor={'right'}
				open={viewDrawerOpen}
				onClose={handleViewButtonDrawerToggleClosing}
				variant="temporary"
				sx={{
					width: 350,
					'& .MuiDrawer-paper': {
						width: 350,
						marginTop: 6
					}
				}}
			>
				<div style={{ height: '90vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { xs: '35ch', md: '35ch' }, height: { xs: '55ch', sm: '55ch', md: '55ch' } }}>

						<Typography variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Company Details</Typography>

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
											viewCompData.company_status === 'active' ?
												<>
													<Typography
														sx={{ color: 'green', m: 0.5 }}
														component="span"
														variant="body2"

													> {viewCompData.company_status}</Typography>
												</>
												:
												<>
													<Typography
														sx={{ m: 0.5, color: 'red' }}
														component="span"
														variant="body2"
													>{viewCompData.company_status}</Typography>
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
											{viewCompData.company_name}
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
												Email:
											</Typography>
											{viewCompData.company_email}
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
											{viewCompData.company_address}
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
												Website:
											</Typography>
											{viewCompData.company_website}
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
											{viewCompData.company_contact_no}
										</>
									}
								/>
							</ListItem>
						</List>
					</Paper>
				</div>
			</Drawer>
		)
	}, [viewDrawerOpen, viewCompData])

	//edit button
	const handleEditButton = (row) =>{
		console.log(row)
		setEditDialogOpen(true)
		setEditCompData(row)
		setPrevData(row)

	}
	
	//company edit view
	const compEditView = useMemo(()=>{
		const handleEditDialogClose = () =>{
			setEditDialogOpen(false)
			setEditCompData({})
			setPrevData({})
		}
		const handleEdit = async(e) =>{
			e.preventDefault()
			console.log(editCompData)
			if(!noError && JSON.stringify(prevData)!==JSON.stringify(editCompData)){
				toast.promise(
					axios.put(`/api/editcompany/${editCompData.id}`,editCompData),
					{
						pending: {
							render() {
								return ('Updating Company')
							}
						},
						success: {
							render(res) {
								handleEditDialogClose()
								return(res.data.data)
							}
						},
						error: {
							render(err) {
								return(err.data.response.data)
							}
						}
					}

				)
				
			}

		}
		return(
			<>
			<Dialog
			open={editDialogOpen}
			onClose={handleEditDialogClose}
			
			
			
			>
				<DialogTitle>Edit Company</DialogTitle>
				<DialogContent dividers={true}>
				<Paper elevation={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { sm: '50ch', md: '50ch',lg:'50ch' }, height: { sm: '45ch', md: '45ch' ,lg:'50ch'}}}>
                
                <Box sx={{m:1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: { sm: '45ch', md: '45ch',lg:'45ch' }, height: { sm: '40ch', md: '40ch',lg:'45ch' }, p: 1 }}>
                  <form id='editcompany' onSubmit={handleEdit} >
				  <FormControl fullWidth sx={{mt:1, mb: 2 }} variant="outlined">
                    <InputLabel size='small' required htmlFor="outlined-adornment-editcompany">Company Name</InputLabel>
                    <OutlinedInput
					size='small'
                      required={true}
                      id="outlined-adornment-editcompany"
                      type={'text'}
                      label="Company Name"
					  name="companyName"
					  value={editCompData.company_name}
					  onInput={(e)=>setEditCompData({...editCompData,company_name:e.target.value})}
                      placeholder='enter comapany name'
                      
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    <InputLabel size='small' required htmlFor="outlined-adornment-editcomp_email">Email</InputLabel>
                    <OutlinedInput
					size='small'
                      name='companyEmail'
					  value={editCompData.company_email}
					  onInput={(e)=>setEditCompData({...editCompData,company_email:e.target.value})}
                      required={true}
                      id="outlined-adornment-editcomp_email"
                      type={'email'}
                      label="Email"
                      placeholder='enter company email'
                      

                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    <InputLabel size='small' required htmlFor="outlined-adornment-editcomp_addr">Company Address</InputLabel>
                    <OutlinedInput
					size='small'
                      name='companyAddress'
					  value={editCompData.company_address}
					  onInput={(e)=>setEditCompData({...editCompData,company_address:e.target.value})}
                      required={true}
                      multiline
                      id="outlined-adornment-editcomp_addr"
                      type={'text'}
                      label="Company Address"
                      minRows={4}
                      maxRows={4}
                      placeholder="enter company address"
                      

                    />
                  </FormControl>
				  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    <InputLabel size='small'>Company Website</InputLabel>
                    <OutlinedInput
                    size='small'
                      name='companyWebsite'
                      value={editCompData.company_website}                     
                      type={'text'}
                      label="Company Website"
                      placeholder='enter comapany webiste'
                      onInput={e=>setEditCompData({...editCompData,company_website:e.target.value})}
                    />
                  </FormControl>
				  <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                    
                    <TextField
					size='small'
                      error={noError}
                      name='companyContactNo'
                      value={editCompData.company_contact_no}
                      helperText="Please enter contact no. with country code ex:+91xxx..."
                      required={true}
                      id="outlined-adornment-companycontactno"
                      type='text'
                      label="Company Contact No"
                      placeholder='enter comapany contact no'
                      onChange={e=>{
                        
                        const val= e.target.value
                        if(phone(val).isValid || val===''){
							setNoError(false)
							setEditCompData({...editCompData,company_contact_no:val})
						  }
						  else{
							setEditCompData({...editCompData,company_contact_no:val})
							setNoError(true)
						  }
                        
                      }}
                      
                      
                    />
                  </FormControl>

                  
                  <FormControl sx={{ mb: 2 }} fullWidth variant="outlined" >
                    <InputLabel size='small' required>Status</InputLabel>
                    <Select
					size='small'
					  name='companyStatus'
                      label="Status"
                      required
					  value={editCompData.company_status}
					  onChange={(e)=>setEditCompData({...editCompData,company_status:e.target.value})}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="denied">Denied</MenuItem>
                    </Select>
                  </FormControl>

				  </form>
                  

                </Box>
              </Paper>
				</DialogContent>
				<DialogActions>
					<Button  color='error' onClick={handleEditDialogClose}>Cancel</Button>
					<Button  color='success' type='submit' form='editcompany' >Update</Button>
				</DialogActions>

			</Dialog>
			</>
		)
	},[editDialogOpen,editCompData,noError,prevData])

	//table searchbar
	const subHeaderViewCompanyMemo = React.useMemo(() => {
		const handleSearch = (e) => {
			//console.log(e.target.value)
			//console.log(data)			
			const filteredData = data.filter(d => (d.company_name).toLowerCase().includes((e.target.value).toLowerCase()))
			//console.log(filteredCompany)
			setFilteredCompany(filteredData)

		}

		return (
			<Box>
				<TextField variant='outlined' size='small' placeholder='search comapny' onInput={handleSearch} InputProps={{ endAdornment: <SearchIcon /> }} />
			</Box>

		);
	}, [data]);

	//row selection
	const handleRowSelected = React.useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

	//handling selected row operation
	const contextActions = React.useMemo(() => {
		const handleDelete = async () => {
			//console.log(selectedRows.map(details => details.id))
			let msg = ''
			try {
				const result = await toast.promise(
					axios.post(`/api/deletecompany/`, { id: selectedRows.map(details => details.id) }),
					{
						pending: {
							render() {
								return ('Deleting Company')
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

	return (
		<>
			<NavBar />
			<Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 8 } }}>
				<div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Typography variant='h5' component={'h5'} m={2} textAlign={'center'} >View Company</Typography>
					<div style={{ height: '400px', width: '95%' }}>
						<Card>
							<DataTable
								title=" "
								fixedHeader={true}
								fixedHeaderScrollHeight='250px'
								columns={columns}
								data={filteredCompany}
								selectableRows
								contextActions={contextActions}
								onSelectedRowsChange={handleRowSelected}
								clearSelectedRows={toggleCleared}
								pagination
								dense
								subHeader
								subHeaderComponent={subHeaderViewCompanyMemo}
								customStyles={customStyles}


							/>
						</Card>
					</div>
				</div>
			</Box>
			{compDetailView}
			{compEditView}
			<Loader loader={loader} /> 
		</>
	);
};

export default ViewCompany