import React, { useContext, useState } from 'react'
import { Container, Stack, Typography, Button, InputLabel, FormControl, OutlinedInput, Box, } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserContext from '../../context/UserContext';


function ContactInfo(props) {
    const { contactInfo, setContactInfo } = props
    const [prevData, setPrevData] = useState(contactInfo)
    const { userDetails } = useContext(UserContext)


    const handleContactInfoChange = (e) => {
        const { name, value } = e.target
        setContactInfo({ ...contactInfo, [name]: value })
    }
    const handleContactInfoSubmit = (e) => {
        e.preventDefault()
        //console.log(contactInfo)
        if (contactInfo.mobile1 === '' && contactInfo.mobile2 === '' && contactInfo.mobile3 === '' && contactInfo.mobile4 === '' && contactInfo.mobile5 === '') {
            toast.warning('please fill atleast one field of Mobile')
        }
        else if (contactInfo.aol === '' && contactInfo.msn === '' && contactInfo.skype === '' && contactInfo.yahoo === '' && contactInfo.gtalk === '') {
            toast.warning(`please fill atleast one field of Im's`)
        }
        else if (String(contactInfo.zip_code).length !== 6) {
            toast.warning(`please enter valid 6 digit zip code`)
        }

        else {
            const varify = /^\+?[0-9]{6,14}$/;
            if (contactInfo.home_phone !== '' && !varify.test(contactInfo.home_phone)) {
                toast.warning(`Home Phone number is not valid`)
            }
            else if (contactInfo.office_phone !== '' && !varify.test(contactInfo.office_phone)) {
                toast.warning(`Office Phone number is not valid`)
            }
            else if (contactInfo.mobile1 !== '' && !varify.test(contactInfo.mobile1)) {
                toast.warning(`Mobile 1 Phone number is not valid`)
            }
            else if (contactInfo.mobile2 !== '' && !varify.test(contactInfo.mobile2)) {
                toast.warning(`Mobile 2 Phone number is not valid`)
            }
            else if (contactInfo.mobile3 !== '' && !varify.test(contactInfo.mobile3)) {
                toast.warning(`Mobile 3 Phone number is not valid`)
            }
            else if (contactInfo.mobile4 !== '' && !varify.test(contactInfo.mobile4)) {
                toast.warning(`Mobile 4 Phone number is not valid`)
            }
            else if (contactInfo.mobile5 !== '' && !varify.test(contactInfo.mobile5)) {

                toast.warning(`Mobile 5 Phone number is not valid`)
            }
            else {

                if (userDetails && JSON.stringify(prevData) !== JSON.stringify(contactInfo)) {
                    toast.promise(
                        axios.post('/api/addcontactinformation', { ...contactInfo, emp_id: userDetails.employee_id }),
                        {

                            pending: {
                                render() {

                                    return ('Adding Conatact Information')
                                }
                            },
                            success: {
                                render(res) {
                                    setPrevData(contactInfo)
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
            }

        }

    }
    return (
        <>
            <form onSubmit={handleContactInfoSubmit} >

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'cenetr', }}>
                    <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' }, borderBottom: { xs: '1px solid black', lg: 'none' } }}>
                        <Typography variant="p" component={'h5'} mb={2} textAlign={'center'}> Contact Information</Typography>
                        <Stack spacing={2} >
                            <FormControl fullWidth variant="outlined">
                                <InputLabel size="small" required  >Address</InputLabel>
                                <OutlinedInput size="small" name="address" value={contactInfo.address} onChange={handleContactInfoChange} multiline minRows={3} maxRows={3} type={"text"} label="Address" placeholder="enter your address" required />
                            </FormControl>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel size="small" required  >Zip Code</InputLabel>
                                <OutlinedInput size="small" name="zip_code" value={contactInfo.zip_code} onChange={e => (e.target.value).length <= 6 ? setContactInfo({ ...contactInfo, zip_code: e.target.value }) : null} type={"number"} label="Zip Code" placeholder='enter your area 6-digit zip code' required />
                            </FormControl>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small"  >Home Phone</InputLabel>
                                    <OutlinedInput size="small" name="home_phone" value={contactInfo.home_phone} onChange={handleContactInfoChange} type={"text"} label="Home Phone" />
                                </FormControl>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small"  >Ext.</InputLabel>
                                    <OutlinedInput size="small" name="home_phone_ext" value={contactInfo.home_phone_ext} onChange={handleContactInfoChange} type={"number"} label="Ext." />
                                </FormControl>


                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 1, md: 2, lg: 2 }}  >
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small"  >Office Phone</InputLabel>
                                    <OutlinedInput size="small" name="office_phone" value={contactInfo.office_phone} onChange={handleContactInfoChange} type={"text"} label="Office Phone" />
                                </FormControl>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small"  >Ext.</InputLabel>
                                    <OutlinedInput size="small" name="office_phone_ext" value={contactInfo.office_phone_ext} onChange={handleContactInfoChange} type={"number"} label="Ext." />
                                </FormControl>


                            </Stack>


                        </Stack>
                    </Container>




                    <Container >
                        <Stack direction={'row'} spacing={1}>

                            <Box sx={{ m: 1 }} >
                                <Typography variant="p" component={'h5'} mb={2} textAlign={'center'}  >Mobile*</Typography>
                                <Stack spacing={1.7}>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >Mobile 1</InputLabel>
                                        <OutlinedInput inputProps={{ pattern: "[0-9]{5}[-][0-9]{7}[-][0-9]{1}" }} size="small" name="mobile1" value={contactInfo.mobile1} onChange={handleContactInfoChange} type={"tel"} label="Mobile 1" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >Mobile 2</InputLabel>
                                        <OutlinedInput size="small" name="mobile2" value={contactInfo.mobile2} onChange={handleContactInfoChange} type={"tel"} label="Mobile 2" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >Mobile 3</InputLabel>
                                        <OutlinedInput size="small" name="mobile3" value={contactInfo.mobile3} onChange={handleContactInfoChange} type={"tel"} label="Mobile 3" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >Mobile 4</InputLabel>
                                        <OutlinedInput size="small" name="mobile4" value={contactInfo.mobile4} onChange={handleContactInfoChange} type={"tel"} label="Mobile 4" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >Mobile 5</InputLabel>
                                        <OutlinedInput size="small" name="mobile5" value={contactInfo.mobile5} onChange={handleContactInfoChange} type={"tel"} label="Mobile 5" />
                                    </FormControl>
                                </Stack>


                            </Box>

                            <Box sx={{ m: 1 }} >
                                <Typography variant="p" component={'h5'} mb={2} textAlign={'center'} >Im's*</Typography>
                                <Stack spacing={1.7}>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >MSN</InputLabel>
                                        <OutlinedInput size="small" name="msn" value={contactInfo.msn} onChange={handleContactInfoChange} type={"email"} label="MSN" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >AOL</InputLabel>
                                        <OutlinedInput size="small" name="aol" value={contactInfo.aol} onChange={handleContactInfoChange} type={"email"} label="AOL" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >SKYPE</InputLabel>
                                        <OutlinedInput size="small" name="skype" value={contactInfo.skype} onChange={handleContactInfoChange} type={"email"} label="SKYPE" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >YAHOO</InputLabel>
                                        <OutlinedInput size="small" name="yahoo" value={contactInfo.yahoo} onChange={handleContactInfoChange} type={"email"} label="YAHOO" />
                                    </FormControl>
                                    <FormControl variant="outlined">
                                        <InputLabel size="small"  >GTALK</InputLabel>
                                        <OutlinedInput size="small" name="gtalk" value={contactInfo.gtalk} onChange={handleContactInfoChange} type={"email"} label="GTALK" />
                                    </FormControl>
                                </Stack>


                            </Box>
                        </Stack>

                    </Container >


                </Box>
                <Stack display={'flex'} justifyContent={'center'} direction={'row'} mt={2}>
                    <Button size="small" variant="contained" color='success' type='submit' >submit</Button>
                </Stack>


            </form>
            {/* <Loader loader={loader} /> */}
        </>
    )
}

export default ContactInfo