import { Container, Box, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography, IconButton } from '@mui/material'
import React, { useState } from 'react'

import axios from 'axios'
import { toast } from 'react-toastify';
//import { phone } from 'phone';
import styled from "styled-components";

import { Business, Delete } from '@mui/icons-material';
import AccessNavBar from '../../Comman/NavBar/AccessNavBar';


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
function AddComapny() {
  const [noError, setNoError] = useState(false)
  const [addCompData, setAddCompData] = useState({
    companyName: '',
    companyEmail: '',
    companyWebsite: '',
    companyAddress: '',
    companyContactNo: '',
    companyStatus: ''
  })
  const [logo, setLogo] = useState('')
  const [companyLogoUrl, setCompanyLogoUrl] = useState('')

  const handleAddFormData = (e) => {
    //console.log(e.target.name)
    setAddCompData({ ...addCompData, [e.target.name]: e.target.value })
  }
  const handleResetCompForm = () => {
    //console.log(addCompData)
    setAddCompData({
      companyName: '',
      companyEmail: '',
      companyAddress: '',
      companyWebsite: '',
      companyContactNo: '',
      companyStatus: ''
    })
    setNoError(false)
    setCompanyLogoUrl('')
    setLogo([])
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {

        reject(error);
      };
    });
  };

  const handleCapture = async(e) => {
    if(e.target.files.length!==0){
      setLogo(e.target.files[0])
    const url = await convertBase64(e.target.files[0])
    setCompanyLogoUrl(url)
    }
    
  }

  const handleSubmitCompForm =  (e) => {

    e.preventDefault()

     if (!noError&& logo.length!==0) {
      const formData = new FormData()
      formData.append('file',logo)
      formData.append('addComData', JSON.stringify(addCompData))
      toast.promise(axios.post('/api/addcompany', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }),
        {
          pending: {
            render() {
              return ('Adding Company')
            }
          },
          success: {
            render(res) {
              handleResetCompForm()
              return (res.data.data)
            }
          },
          error: {
            render(err) {
              return (err.data.response.data)
            }
          }
        }

      )
  
    }
    else{
      toast.warning('Choose image to upload!')
    }


  }

  return (
    <>

      <Box sx={{ height: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
        <AccessNavBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
          <div style={{ height: 'auto', width: '100%', }} >
            <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Add Company</Typography>
            <Grid container display={'flex'} justifyContent={'center'}>
              <Grid item sm={12} xs={12} md={10} lg={10}>
                <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', p: 1 }}>
                  <Box component={'form'} onSubmit={handleSubmitCompForm} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', p: 1 }}>
                    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      {companyLogoUrl ?
                        
                        <img src={companyLogoUrl} alt='logo' style={{ maxWidth: '250px', height: '60px', backgroundColor:'#E0E0E0'}} />
                         :
                        <Business sx={{ fontSize: '60px', mt: 1, mb: 0 }} />
                      }
                      <Stack direction={'row'} spacing={0.1}>
                    <Button type="file" size="small" component="label"  > Upload Logo <VisuallyHiddenInput required type="file"  onInput={handleCapture} accept="image/png, image/jpeg"  max={1}/> </Button>
                        {
                             companyLogoUrl?
                             <IconButton size='small' color='error' onClick={()=>{
                              setLogo([])
                              setCompanyLogoUrl('')
                              }}>
                            <Delete fontSize='15px' />
                        </IconButton>
                        :null

                        }
                        
                    </Stack>
                      

                    </Container>
                    <Container sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center' }}>

                      <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' }, borderBottom: { xs: '1px solid black', lg: 'none' } }}>
                        <Stack spacing={2}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >

                            <FormControl fullWidth sx={{ mb: 1, mt: 1 }} variant="outlined">
                              <InputLabel size='small' required htmlFor="outlined-adornment-company">Company Name</InputLabel>
                              <OutlinedInput
                                size='small'
                                name='companyName'
                                value={addCompData.companyName}
                                required={true}
                                id="outlined-adornment-company"
                                type={'text'}
                                label="Company Name"
                                placeholder='enter comapany name'
                                onInput={handleAddFormData}
                              />
                            </FormControl>
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >

                            <FormControl fullWidth sx={{ mb: 1 }} variant="outlined">
                              <InputLabel size='small' required htmlFor="outlined-adornment-comp_email">Email</InputLabel>
                              <OutlinedInput
                                size='small'
                                name='companyEmail'
                                value={addCompData.companyEmail}
                                required={true}
                                id="outlined-adornment-comp_email"
                                type={'email'}
                                label="Email"
                                placeholder='enter company email'
                                onInput={handleAddFormData}

                              />
                            </FormControl>
                          </Stack>
                          <FormControl fullWidth sx={{ mb: 1 }} variant="outlined">
                            <InputLabel size='small' required htmlFor="outlined-adornment-comp_addr">Company Address</InputLabel>
                            <OutlinedInput
                              size='small'
                              name='companyAddress'
                              value={addCompData.companyAddress}
                              required={true}
                              multiline
                              id="outlined-adornment-comp_addr"
                              type={'text'}
                              label="Company Address"
                              minRows={2}
                              maxRows={2}
                              placeholder="enter company address"
                              onInput={handleAddFormData}
                            />
                          </FormControl>
                        </Stack>
                      </Container>
                      <Container >
                        <Stack spacing={2}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}   >
                            <FormControl fullWidth sx={{ mb: 1 }} variant="outlined">
                              <TextField
                                size='small'
                                error={noError}
                                name='companyContactNo'
                                value={addCompData.companyContactNo}
                                helperText="Please enter contact no. with country code ex:+91xxx..."
                                required={true}
                                id="outlined-adornment-companycontactno"
                                type='text'
                                label="Company Contact No"
                                placeholder='enter comapany contact no'
                                onChange={e => {
                                  ////console.log(e.target.value)
                                  const val = e.target.value
                                  ////console.log(phone(val).isValid)
                                  setAddCompData({ ...addCompData, companyContactNo: val })
                                  // if (phone(val).isValid || val === '') {
                                  //   setNoError(false)
                                  //   setAddCompData({ ...addCompData, companyContactNo: val })
                                  // }
                                  // else {
                                  //   setAddCompData({ ...addCompData, companyContactNo: val })
                                  //   setNoError(true)
                                  // }
                                }}
                              />
                            </FormControl>
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
                            <FormControl sx={{ mb: 1 }} fullWidth variant="outlined" >
                              <InputLabel size='small' required>Status</InputLabel>
                              <Select
                                size='small'
                                label="Status"
                                name="companyStatus"
                                value={addCompData.companyStatus}
                                required
                                onChange={handleAddFormData}

                              >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="denied">Denied</MenuItem>
                              </Select>
                            </FormControl>
                          </Stack>
                          <FormControl fullWidth sx={{ mb: 1 }} variant="outlined">
                            <InputLabel size='small'>Company Website</InputLabel>
                            <OutlinedInput
                              size='small'
                              name='companyWebsite'
                              value={addCompData.companyWebsite}
                              type={'text'}
                              label="Company Website"
                              placeholder='enter comapany webiste'
                              onInput={handleAddFormData}
                            />
                          </FormControl>
                        </Stack>
                      </Container>
                    </Container>
                    <Stack mt={2} spacing={5} direction="row" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <Button size='small' variant="outlined" color='success' type='submit' >ADD</Button>
                      <Button size='small' variant="outlined" color='error' onClick={handleResetCompForm} >Clear</Button>
                    </Stack>

                  </Box>
                </Paper>
              </Grid>
            </Grid>


          </div>
        </Box>
      </Box>


    </>
  )
}

export default AddComapny