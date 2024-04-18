import { Autocomplete, Button, Box, Grid, Paper, TextField, Typography, Container, FormControl, Stack, Stepper, Step, StepLabel, StepContent, IconButton, DialogTitle, DialogContent, Dialog, DialogActions, Fade, Collapse, SvgIcon } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Add, Close, Edit, TrendingUp } from '@mui/icons-material'
import swal from 'sweetalert'
import Loader from '../../Comman/Loader'
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'

//import { makeStyles } from '@material-ui/styles';



function Experience() {
  const [loader, setLoader] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [users, setUsers] = useState([])
  const [newPromotionData, setNewPromotionData] = useState({ emp_id: '', prev_promotion_title: '', prev_promotion_date: '', promotion_title: '', promotion_date: '', roles_and_responsibility: '' })
  const [promotionDialog, setPromotionDialog] = useState(false)
  const [modifyPromotionData, setModifyPromotionData] = useState({ emp_id: '', promotion_id: '', promotion_title: '', promotion_date: '', roles_and_responsibility: '' ,date_of_joining:'', prev_promotion_date:''})
  const [modifyPromotionDialog, setModifyPromotionDialog] = useState(false)
  const [activateModify, setActivateModify] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [experienceData, setExperienceData] = useState([])
  const [prevModificationData, setPrevModificationData] = useState(modifyPromotionData)

  //const classes = useStyles();


 

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const userData = await axios.get('/api/getemployeedata')
        ////console.log(userData)
        setUsers(userData.data)

        setLoader(false)
      }
      catch(err) {

        toast.error(err.response.data)
      }
    }
    fetchUserData()
  }, [])

  const getUserExperinceData = (emp_id) => {
    //console.log(emp_id)
    axios.post('/api/getuserexperience', { emp_id: emp_id })
      .then(res => {
        ////console.log(res.data)
        setLoader(false)
        const data = res.data.map((exp, index) => ({
          ...exp,
          timerange: `${new Date(exp.promotion_date).toLocaleString(undefined, { month: 'short', year: 'numeric' })} - ${res.data[index + 1] === undefined ? 'Present' : new Date(res.data[index + 1].promotion_date).toLocaleString(undefined, { month: 'short', year: 'numeric' })}`,
          roles_and_responsibility: `${exp.roles_and_responsibility === '' ? 'Not Mentioned' : exp.roles_and_responsibility}`

        })).reverse()
        setExperienceData(data)
        //console.log('data', res.data)

      })
      .catch((err) => {
        setLoader(false)
        toast.error(err.response.data)
      })

  }

  const handleUserSelection = (_, newValue) => {
    ////console.log(newValue)
    if (newValue !== null) {
      const { value } = newValue
      getUserExperinceData(value.employee_id)
      setLoader(true)
      setSelectedUser(newValue)

    }
    else {
      setExperienceData([])
      setSelectedUser(null)
    }

  }

  const handleAddPromotionOpen = () => {
    setPromotionDialog(true)
    const prevData = experienceData[0]
    const { emp_id, promotion_title, promotion_date } = prevData
    //console.log(promotion_title, promotion_date)
    setNewPromotionData({ ...newPromotionData, emp_id: emp_id, prev_promotion_title: promotion_title, prev_promotion_date: new Date(promotion_date).toLocaleString('en-CA').slice(0, 10),date_of_joining: new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10) })
  }

  const handleActivateModifyPromotion = () => {
    setActivateModify(prev => !prev)
  }

  const handleModifyPromotion = (exp,index) => {
    //console.log(new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10))
    setModifyPromotionDialog(true)
    setModifyPromotionData({ ...exp, promotion_date: new Date(exp.promotion_date).toLocaleString('en-CA').slice(0, 10),date_of_joining: new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10), prev_promotion_date: experienceData[index+1]===undefined?new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10): new Date(experienceData[index+1].promotion_date).toLocaleString('en-CA').slice(0, 10) })
    setPrevModificationData({ ...exp, promotion_date: new Date(exp.promotion_date).toLocaleString('en-CA').slice(0, 10),date_of_joining: new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10), prev_promotion_date: experienceData[index+1]===undefined?new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10): new Date(experienceData[index+1].promotion_date).toLocaleString('en-CA').slice(0, 10) })
    //console.log(index,experienceData[index+1],{ ...exp, promotion_date: new Date(exp.promotion_date).toLocaleString('en-CA').slice(0, 10),date_of_joining: new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10), prev_promotion_date: experienceData[index+1]===undefined?new Date(selectedUser.value.date_of_joining).toLocaleString('en-CA').slice(0, 10): new Date(experienceData[index+1].promotion_date).toLocaleString('en-CA').slice(0, 10) })
  }



  const modifyPromotion = useMemo(() => {

    const handleModifyPromotionClose = () => {
      setModifyPromotionData({ emp_id: '', promotion_id: '', promotion_title: '', promotion_date: '', roles_and_responsibility: '' ,date_of_joining:'', prev_promotion_date:''})
      setPrevModificationData({ emp_id: '', promotion_id: '', promotion_title: '', promotion_date: '', roles_and_responsibility: '',date_of_joining:'', prev_promotion_date:'' })
      setModifyPromotionDialog(false)

    }
    const handleModifyPromotionSubmit = (e) => {
      e.preventDefault()
      ////console.log('submit', newPromotionData)
      
      if (JSON.stringify(prevModificationData) !== JSON.stringify(modifyPromotionData)) {
        if(new Date(modifyPromotionData.date_of_joining)> new Date(modifyPromotionData.promotion_date)){
          toast.warning('Promotion Date Should not less than joining date')
        }
        else{
          toast.promise(axios.post('/api/modifypromotion', modifyPromotionData), {
            pending: {
              render() {
                return 'Modifying Promotion'
              }
            },
            success: {
              render(res) {
                getUserExperinceData(modifyPromotionData.emp_id)
                handleModifyPromotionClose()
                return res.data.data
              }
            },
            error: {
              render(err) {
                return (err.data.response.data)
              }
            }
          })
        }
          
        }
        


    }

    const handleDeletePromotion = (exp) => {
      swal({
        title: "Do you want to delete promotion?",

        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            toast.promise(axios.post('/api/deletepromotion', exp), {
              pending: {
                render() {
                  return 'Deleting Promotion'
                }
              },
              success: {
                render(res) {
                  getUserExperinceData(exp.emp_id)
                  handleModifyPromotionClose()
                  return res.data.data
                }
              },
              error: {
                render(err) {
                  return (err.data.response.data)
                }
              }
            })
          }
        });

    }

    return (
      <>
        <Dialog
          open={modifyPromotionDialog}
          onClose={handleModifyPromotionClose}
          maxWidth='800px'
        >
          <DialogTitle>Modify Promotion</DialogTitle>
          <DialogContent dividers={true}>
            <Paper elevation={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'auto', height: 'auto' }}>

              <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'auto', p: 1 }}>
                <form id='modifypromotion' onSubmit={handleModifyPromotionSubmit}  >
                  <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Stack width={{ xs: '100%', lg: '400px' }} spacing={2}>


                      <FormControl fullWidth>
                        <TextField
                          label='Promotion Title'
                          type='text'
                          size='small'
                          required
                          value={modifyPromotionData.promotion_title}
                          inputProps={{ maxLength: 295 }}
                          onChange={e => setModifyPromotionData({ ...modifyPromotionData, promotion_title: e.target.value })}
                        />

                      </FormControl>


                      <FormControl fullWidth>
                        <TextField
                          label='Promotion Date'
                          type='date'
                          InputLabelProps={{ shrink: true }}
                          size='small'
                          required
                          inputProps={{min:modifyPromotionData.prev_promotion_date, max:new Date().toLocaleString('en-CA').slice(0,10)}}
                          value={modifyPromotionData.promotion_date}
                          onChange={e => setModifyPromotionData({ ...modifyPromotionData, promotion_date: e.target.value })}
                        />

                      </FormControl>
                      <FormControl fullWidth>
                        <TextField
                          multiline
                          type='text'
                          minRows={4}
                          maxRows={4}
                          label='Roles & Responsibility'
                          required
                          value={modifyPromotionData.roles_and_responsibility}
                          inputProps={{ maxLength: 495 }}
                          onChange={e => setModifyPromotionData({ ...modifyPromotionData, roles_and_responsibility: e.target.value })}
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <Button variant='outlined' size='small' color='secondary' onClick={() => handleDeletePromotion(modifyPromotionData)}>Delete Experience</Button>
                      </FormControl>
                    </Stack>

                  </Container>
                </form>
              </Box>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button color='error' onClick={handleModifyPromotionClose} >Cancel</Button>
            <Button color='success' type='submit' form='modifypromotion' >Modify</Button>
          </DialogActions>
        </Dialog>
      </>
    )

  }, [modifyPromotionData, modifyPromotionDialog, prevModificationData])


  const addPromotion = useMemo(() => {
    const handleAddPromotionClose = () => {
      setNewPromotionData({ emp_id: '', prev_promotion_title: '', prev_promotion_date: '', promotion_title: '', promotion_date: '', roles_and_responsibility: '' })
      setPromotionDialog(false)

    }
    const handleAddNewPromotion = (e) => {
      e.preventDefault()
      //console.log('submit', newPromotionData)
      if(new Date(newPromotionData.date_of_joining)> new Date(newPromotionData.promotion_date)){
        toast.warning('Promotion Date Should not less than joining date')
      }
      else{
        toast.promise(axios.post('/api/addnewpromotion', newPromotionData), {
          pending: {
            render() {
              return 'Adding New Promotion'
            }
          },
          success: {
            render(res) {
              getUserExperinceData(newPromotionData.emp_id)
              handleAddPromotionClose()
              return res.data.data
            }
          },
          error: {
            render(err) {
              return err.data.response.data
            }
          }
        })

      }
      
    }
    return (
      <>
        
          <Box>
            <Dialog
              open={promotionDialog}
              onClose={handleAddPromotionClose}
              maxWidth='800px'


            >
              <DialogTitle>Add Promotion</DialogTitle>
              <DialogContent dividers={true}>
                <Paper elevation={1} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'auto', height: 'auto' }}>

                  <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'auto', p: 1 }}>
                    <form id='addpromotion' onSubmit={handleAddNewPromotion}>
                      <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Stack spacing={2}>
                          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                            <FormControl fullWidth>
                              <TextField
                                label='Prev Promotion Title'
                                type='text'
                                size='small'
                                value={newPromotionData.prev_promotion_title}
                                inputProps={{ maxLength: 295 }}
                                disabled
                              />

                            </FormControl>
                            <FormControl fullWidth>
                              <TextField
                                label='Prev Promotion Date'
                                type='date'
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                value={newPromotionData.prev_promotion_date}
                                disabled
                              />

                            </FormControl>
                          </Stack>

                          <FormControl fullWidth>
                            <TextField
                              label='Promotion Title'
                              type='text'
                              size='small'
                              required
                              inputProps={{ maxLength: 495 }}
                              value={newPromotionData.promotion_title}
                              onChange={e => setNewPromotionData({ ...newPromotionData, promotion_title: e.target.value })}
                            />

                          </FormControl>


                          <FormControl fullWidth>
                            <TextField
                              label='Promotion Date'
                              type='date'
                              InputLabelProps={{ shrink: true }}
                              inputProps={{min:newPromotionData.prev_promotion_date, max:new Date().toLocaleString('en-CA').slice(0,10)}}
                              size='small'
                              required
                              value={newPromotionData.promotion_date}
                              onChange={e => setNewPromotionData({ ...newPromotionData, promotion_date: e.target.value })}
                            />

                          </FormControl>
                          <FormControl fullWidth>
                            <TextField
                              multiline
                              type='text'
                              minRows={4}
                              maxRows={4}
                              label='Roles & Responsibility'
                              required
                              value={newPromotionData.roles_and_responsibility}
                              onChange={e => setNewPromotionData({ ...newPromotionData, roles_and_responsibility: e.target.value })}
                            />
                          </FormControl>
                        </Stack>

                      </Container>
                    </form>
                  </Box>
                </Paper>
              </DialogContent>
              <DialogActions>
                <Button color='error' onClick={handleAddPromotionClose} >Cancel</Button>
                <Button color='success' type='submit' form='addpromotion' >Add</Button>
              </DialogActions>
            </Dialog>
          </Box>
        
      </>
    )
  }, [newPromotionData, promotionDialog])

  return (
    <>
      <Box sx={{ minHeight: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
       <AccessNavBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
          <div
            style={{
              height: 'auto',
              width: '100%',

            }}
          >
            <Typography variant='h5' component={'h5'} display={'flex'} justifyContent={'center'} alignItems={'center'} m={0.5} textAlign={'center'} >Experience<TrendingUp /></Typography>
            <Grid container display={'flex'} justifyContent={'center'}>
              <Grid item xs={12} sm={12} lg={10}>
                <Paper elevation={10} sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', p: 1 }}>
                  <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', p: 1 }}>
                    <Box style={{ width: '100%' }}>
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <Autocomplete
                            size='small'
                            inputValue={inputValue}
                            disablePortal
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            options={users}
                            getOptionLabel={(option) => option.label || ""}
                            onChange={handleUserSelection}
                            onInputChange={(_, newInputValue) => {
                              setInputValue(newInputValue)
                            }}
                            value={selectedUser}
                            renderInput={(params) => <TextField fullWidth size='small' {...params} required label="Select Employee" />}
                          />

                        </FormControl>
                        <Collapse in={experienceData.length !== 0} unmountOnExit timeout={'auto'} >
                          <Container sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                            <Stack direction={'row'} spacing={1}>
                              <IconButton color="success" title='Add Promotion' size='small' onClick={handleAddPromotionOpen}>
                                <Add />
                              </IconButton>
                              <IconButton color={!activateModify ? 'info' : 'error'} title={!activateModify ? 'Modify Promotions' : 'Cancle Modify Promotions'} size='small' onClick={handleActivateModifyPromotion}>
                                {
                                  !activateModify ? <Edit /> : <Close />
                                }

                              </IconButton>
                            </Stack>
                          </Container>
                          <Box sx={{ borderTop: '2px solid gray', borderBottom: '2px solid gray', height: 'auto' }}>
                            <Stepper orientation="vertical" sx={{ mb: 1, }}>
                              {experienceData.map((exp,index) => (
                                <Step active key={exp.promotion_title}>
                                  <StepLabel icon={<SvgIcon><svg fill="#AB7C94"  focusable="false" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"></circle><text x="12" y="12" fill="white" fontSize= "0.75rem" textAnchor="middle" dominantBaseline="central">{experienceData.length-index}</text></svg></SvgIcon>}  optional={<Typography variant="caption">{exp.timerange}</Typography>}><span style={{fontWeight:'bold'}}>{exp.promotion_title} </span> </StepLabel>
                                  <StepContent>
                                    <Typography
                                      sx={{ display: 'inline' }}
                                      component="span"
                                      variant="body1"
                                      color="text.primary"
                                      fontSize={12}
                                      mr={0.5}
                                    >
                                      Roles & Responsibilities:
                                    </Typography>
                                    <span style={{ fontSize: '12px', color: 'gray' }}>{exp.roles_and_responsibility}</span>
                                    {
                                      activateModify ?
                                        <Fade in={activateModify} unmountOnExit>
                                          <Box sx={{ mt: 1 }}>
                                            <Button sx={{ maxHeight: 25 }} onClick={() => handleModifyPromotion(exp,index)} variant='outlined' color='info' size='small'>Edit</Button>
                                          </Box>
                                        </Fade>

                                      : null
                                    }
                                  </StepContent>
                                </Step>
                              ))}
                            </Stepper>

                          </Box>
                        </Collapse>
                        {experienceData.length === 0 ?
                          <Box sx={{ maxHeight: '300px', width: '100%', display: 'flex', justifyContent: 'center', }}>
                            <img style={{ objectFit: 'contain', width: '100%', height: 'auto' }} src='exp.png' alt='experience' />
                          </Box>
                          : null
                        }


                      </Stack>
                    </Box>
                  </Container>

                </Paper>
              </Grid>
            </Grid>
          </div>
        </Box>
        {addPromotion}
        {modifyPromotion}

      </Box>
      <Loader loader={loader} />
    </>
  )
}

export default Experience