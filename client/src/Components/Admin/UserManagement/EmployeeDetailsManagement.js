import { Autocomplete, Box, Button, Card, CardActions, CardMedia, Checkbox, Collapse, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Cancel, Close, Edit, Preview, UploadFile } from '@mui/icons-material'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import CryptoJS from 'crypto-js'
import Loader from '../../Comman/Loader'


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

function EmployeeDetailsManagement() {
    const [loader, setLoader] = useState(true)
    const [inputValue, setInputValue] = useState('')
    const [users, setUsers] = useState([])
    const [userData, setUserData] = useState({ user: null, status: '', department: '', user_type: '' })
    const [selectedDocs, setSelectedDocs] = useState([]);



    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [sections, setSections] = useState({
        profile: false,
        personalInfo: false,
        contactInfo: false,
        accountInfo: false,
        insurancePolicy: false,
        qualification: false,
        pastWorkExperience: false,
        workDocuments: false

    })
    const [checks, setChecks] = useState({ uanCheck: false, esiCheck: false })

    const [open, setOpen] = useState(false);

    const [employeeDetailsFileds, setEmployeeDetailsFileds] = useState({
        passport_photo: '',
        designation: '',
        emp_id: '',
        date_of_joining: '',
        user_type: '',
        department: '',
        company_name: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        age: '',
        marital_status: '',
        blood_group: '',
        nationality: '',
        spouse_name: '',
        number_of_childrens: '',
        office_email: '',
        personal_email: '',
        mobile_number: '',
        permanent_address: '',
        zip_code: '',
        city: '',
        state: '',
        country: '',
        account_number: '',
        bank_name: '',
        bank_branch: '',
        ifsc_code: '',
        aaddhar_number: '',
        pan_number: '',
        uan: '',
        esi: '',
        secondary_education_percentage: '',
        secondary_education_percentage_file: '',
        higher_secondary_education_percentage: '',
        higher_secondary_education_percentage_file: '',
        diploma_stream: '',
        diploma_percentage: '',
        diploma_file: '',
        graduation_stream: '',
        graduation_percentage: '',
        graduation_file: '',
        post_graduation_stream: '',
        post_graduation_percentage: '',
        post_graduation_file: '',
        past_exp_years: '',
        past_exp_domain: '',
        past_exp_designation: '',
        resignation_letter_file: '',
        appraisal_letter_file: '',
        past_exp_offer_letter_file: '',
        payslips_file: '',
        resume_file: '',
        offer_letter_file: '',
        nda_file: ''
    })

    const [prevEmployeeDetailsFileds, setPrevEmployeeDetailsFileds] = useState(employeeDetailsFileds)

    const handleFileds = (e) => {
        const { name, value } = e.target
        setEmployeeDetailsFileds({ ...employeeDetailsFileds, [name]: value })
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const userData = await axios.get('/api/getemployeedata')
                //console.log(userData)
                setUsers(userData.data)

                setLoader(false)
            }
            catch (err) {
                //console.log(err)
                setLoader(false)

                toast.error('not able to fetch data!')
            }
        }
        fetchUserData()
    }, [])


    const handleUserSelection = (_, newValue) => {
        //console.log(newValue)
        if (newValue !== null) {
            const { value } = newValue
            setLoader(true)
            setUserData({ ...userData, user: newValue, emp_id: value.employee_id, status: value.status, department: value.department, user_type: value.user_type })

            axios.post('/api/employeedata', { emp_id: value.employee_id })
                .then(res => {
                    //console.log(res.data)
                    setLoader(false)
                    setSections({
                        profile: false,
                        personalInfo: false,
                        contactInfo: false,
                        accountInfo: false,
                        insurancePolicy: false,
                        qualification: false,
                        pastWorkExperience: false,
                        workDocuments: false
                    })
                    const decrypted_data = JSON.parse(CryptoJS.AES.decrypt(res.data, process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
                    if (decrypted_data.length !== 0) {
                        //console.log(decrypted_data[0])
                        const data = decrypted_data[0]
                        if (data.uan === '' && data.esi !== '') {
                            setChecks({ uanCheck: false, esiCheck: true })
                        }
                        else if (data.uan !== '' && data.esi === '') {
                            setChecks({ esiCheck: false, uanCheck: true })
                        }
                        else {
                            setChecks({ uanCheck: false, esiCheck: false })
                        }
                        setEmployeeDetailsFileds({ ...data, date_of_birth: new Date(data.date_of_birth).toLocaleString('en-CA').slice(0, 10), date_of_joining: new Date(data.date_of_joining).toLocaleString('en-CA').slice(0, 10) })
                        setPrevEmployeeDetailsFileds({ ...data, date_of_birth: new Date(data.date_of_birth).toLocaleString('en-CA').slice(0, 10), date_of_joining: new Date(data.date_of_joining).toLocaleString('en-CA').slice(0, 10) })
                    }
                    else {
                        setEmployeeDetailsFileds({
                            passport_photo: '',
                            designation: '',
                            emp_id: '',
                            date_of_joining: '',
                            user_type: '',
                            department: '',
                            company_name: '',
                            first_name: '',
                            middle_name: '',
                            last_name: '',
                            gender: '',
                            date_of_birth: '',
                            age: '',
                            marital_status: '',
                            blood_group: '',
                            nationality: '',
                            spouse_name: '',
                            number_of_childrens: '',
                            office_email: '',
                            personal_email: '',
                            mobile_number: '',
                            permanent_address: '',
                            zip_code: '',
                            city: '',
                            state: '',
                            country: '',
                            account_number: '',
                            bank_name: '',
                            bank_branch: '',
                            ifsc_code: '',
                            aaddhar_number: '',
                            pan_number: '',
                            uan: '',
                            esi: '',
                            secondary_education_percentage: '',
                            secondary_education_percentage_file: '',
                            higher_secondary_education_percentage: '',
                            higher_secondary_education_percentage_file: '',
                            diploma_stream: '',
                            diploma_percentage: '',
                            diploma_file: '',
                            graduation_stream: '',
                            graduation_percentage: '',
                            graduation_file: '',
                            post_graduation_stream: '',
                            post_graduation_percentage: '',
                            post_graduation_file: '',
                            past_exp_years: '',
                            past_exp_domain: '',
                            past_exp_designation: '',
                            resignation_letter_file: '',
                            appraisal_letter_file: '',
                            past_exp_offer_letter_file: '',
                            payslips_file: '',
                            resume_file: '',
                            offer_letter_file: '',
                            nda_file: ''
                        })
                    }

                })
                .catch((err) => {
                    //console.log(err)
                    setLoader(false)
                    toast.error(err.response.data)
                })
        }
        else {
            handleCLose()
        }


    }

    function handleCLose() {
        //console.log('closed')
        setEmployeeDetailsFileds({
            passport_photo: '',
            designation: '',
            emp_id: '',
            date_of_joining: '',
            user_type: '',
            department: '',
            company_name: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            gender: '',
            date_of_birth: '',
            age: '',
            marital_status: '',
            blood_group: '',
            nationality: '',
            spouse_name: '',
            number_of_childrens: '',
            office_email: '',
            personal_email: '',
            mobile_number: '',
            permanent_address: '',
            zip_code: '',
            city: '',
            state: '',
            country: '',
            account_number: '',
            bank_name: '',
            bank_branch: '',
            ifsc_code: '',
            aaddhar_number: '',
            pan_number: '',
            uan: '',
            esi: '',
            secondary_education_percentage: '',
            secondary_education_percentage_file: '',
            higher_secondary_education_percentage: '',
            higher_secondary_education_percentage_file: '',
            diploma_stream: '',
            diploma_percentage: '',
            diploma_file: '',
            graduation_stream: '',
            graduation_percentage: '',
            graduation_file: '',
            post_graduation_stream: '',
            post_graduation_percentage: '',
            post_graduation_file: '',
            past_exp_years: '',
            past_exp_domain: '',
            past_exp_designation: '',
            resignation_letter_file: '',
            appraisal_letter_file: '',
            past_exp_offer_letter_file: '',
            payslips_file: '',
            resume_file: '',
            offer_letter_file: '',
            nda_file: ''
        })
        setSections({
            profile: false,
            personalInfo: false,
            contactInfo: false,
            accountInfo: false,
            insurancePolicy: false,
            qualification: false,
            pastWorkExperience: false,
            workDocuments: false
        })
        setPrevEmployeeDetailsFileds({})
        setUserData({ user: null, status: '', department: '', user_type: '' })


    }


    const handleSaveDetails = () => {
        if (JSON.stringify(prevEmployeeDetailsFileds) !== JSON.stringify(employeeDetailsFileds)) {
            const mobileVarify = /^\+?[0-9]{6,14}$/;
            const emailVarify = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
            
            //console.log(employeeDetailsFileds.zip_code!=='' && employeeDetailsFileds.zip_code.length!==6)
            if (employeeDetailsFileds.personal_email!=='' && !emailVarify.test(employeeDetailsFileds.personal_email)) {
                toast.warning('Please enter valid personal email')
            }
            else if (employeeDetailsFileds.mobile_number!==''&& !mobileVarify.test(employeeDetailsFileds.mobile_number)) {
                toast.warning('Please enter valid mobile number')

            }
            else if(employeeDetailsFileds.zip_code!=='' && employeeDetailsFileds.zip_code.length!==6) {
                toast.warning('Please enter valid zip code')

            }
            else {
                const form = new FormData();
                form.append('prev_fields', JSON.stringify(prevEmployeeDetailsFileds))
                form.append('fields', JSON.stringify(employeeDetailsFileds))
                form.append('passport_photo', employeeDetailsFileds.passport_photo[0])
                form.append('secondary_education_percentage_file', employeeDetailsFileds.secondary_education_percentage_file[0])
                form.append('higher_secondary_education_percentage_file', employeeDetailsFileds.higher_secondary_education_percentage_file[0])
                form.append('diploma_file', employeeDetailsFileds.diploma_file[0])
                form.append('graduation_file', employeeDetailsFileds.graduation_file[0])
                form.append('post_graduation_file', employeeDetailsFileds.post_graduation_file[0])
                form.append('resignation_letter_file', employeeDetailsFileds.resignation_letter_file[0])
                form.append('appraisal_letter_file', employeeDetailsFileds.appraisal_letter_file[0])
                form.append('past_exp_offer_letter_file', employeeDetailsFileds.past_exp_offer_letter_file[0])
                form.append('payslips_file', employeeDetailsFileds.payslips_file[0])
                form.append('resume_file', employeeDetailsFileds.resume_file[0])
                form.append('offer_letter_file', employeeDetailsFileds.offer_letter_file[0])
                form.append('nda_file', employeeDetailsFileds.nda_file[0])

                //console.log('formdata', form)
                toast.promise(axios.post('/api/saveemployeedetails', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }), {
                    pending: {
                        render() {
                            return 'Saving Employee Details'
                        }
                    },
                    success: {
                        render(res) {
                            console.log('success')
                            setEmployeeDetailsFileds({
                                passport_photo: '',
                                designation: '',
                                emp_id: '',
                                date_of_joining: '',
                                user_type: '',
                                department: '',
                                company_name: '',
                                first_name: '',
                                middle_name: '',
                                last_name: '',
                                gender: '',
                                date_of_birth: '',
                                age: '',
                                marital_status: '',
                                blood_group: '',
                                nationality: '',
                                spouse_name: '',
                                number_of_childrens: '',
                                office_email: '',
                                personal_email: '',
                                mobile_number: '',
                                permanent_address: '',
                                zip_code: '',
                                city: '',
                                state: '',
                                country: '',
                                account_number: '',
                                bank_name: '',
                                bank_branch: '',
                                ifsc_code: '',
                                aaddhar_number: '',
                                pan_number: '',
                                uan: '',
                                esi: '',
                                secondary_education_percentage: '',
                                secondary_education_percentage_file: '',
                                higher_secondary_education_percentage: '',
                                higher_secondary_education_percentage_file: '',
                                diploma_stream: '',
                                diploma_percentage: '',
                                diploma_file: '',
                                graduation_stream: '',
                                graduation_percentage: '',
                                graduation_file: '',
                                post_graduation_stream: '',
                                post_graduation_percentage: '',
                                post_graduation_file: '',
                                past_exp_years: '',
                                past_exp_domain: '',
                                past_exp_designation: '',
                                resignation_letter_file: '',
                                appraisal_letter_file: '',
                                past_exp_offer_letter_file: '',
                                payslips_file: '',
                                resume_file: '',
                                offer_letter_file: '',
                                nda_file: ''
                            })
                            setSections({
                                profile: false,
                                personalInfo: false,
                                contactInfo: false,
                                accountInfo: false,
                                insurancePolicy: false,
                                qualification: false,
                                pastWorkExperience: false,
                                workDocuments: false
                            })
                            setPrevEmployeeDetailsFileds({})
                            setUserData({ user: null, status: '', department: '', user_type: '' })
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


    }

    const pernalInformation = () => {
        return (
            <>
                <Paper sx={{ m: 2 }}>
                    <Container sx={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                        <Typography variant='p' component={'h3'}>Personal Info</Typography>
                        {
                            !sections.personalInfo ?
                                <IconButton size='small' onClick={() => setSections({ ...sections, personalInfo: true })} >
                                    <Edit />
                                </IconButton>
                                :
                                <IconButton size='small' onClick={() => setSections({ ...sections, personalInfo: false })}>
                                    <Close />
                                </IconButton>
                        }
                    </Container>


                    <Container sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='First Name'
                                    disabled={!sections.personalInfo}
                                    name='first_name'
                                    value={employeeDetailsFileds.first_name}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Middle Name'
                                    disabled={!sections.personalInfo}
                                    name='middle_name'
                                    value={employeeDetailsFileds.middle_name}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Last Name'
                                    disabled={!sections.personalInfo}
                                    name='last_name'
                                    value={employeeDetailsFileds.last_name}
                                    onChange={handleFileds}
                                />

                            </Stack>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small"  >Gender</InputLabel>
                                    <Select name="gender" size="small" label="Gender" disabled={!sections.personalInfo} value={employeeDetailsFileds.gender} onChange={handleFileds}>
                                        <MenuItem value='male'>Male</MenuItem>
                                        <MenuItem value='female'>Female</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Date of Birth'
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                    disabled={!sections.personalInfo}
                                    name='date_of_birth'
                                    value={employeeDetailsFileds.date_of_birth}
                                    onChange={e => {
                                        const today = new Date()
                                        const dob = e.target.value
                                        const age = today.getFullYear() - new Date(dob).getFullYear()
                                        //console.log(new Date(dob).getFullYear(), today.getFullYear())
                                        setEmployeeDetailsFileds({ ...employeeDetailsFileds, date_of_birth: dob, age: age })
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Age'
                                    disabled={!sections.personalInfo}
                                    name='age'
                                    value={employeeDetailsFileds.age}
                                    onChange={handleFileds}
                                />

                            </Stack>

                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small"  >Marital Status</InputLabel>
                                    <Select name="marital_status" size="small" label="Marrital Status" disabled={!sections.personalInfo} value={employeeDetailsFileds.marital_status} onChange={handleFileds}>
                                        <MenuItem value='single'>Single</MenuItem>
                                        <MenuItem value='married'>Married</MenuItem>

                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel size="small"  >Blood Group</InputLabel>
                                    <Select name="blood_group" size="small" label="Blood Group" disabled={!sections.personalInfo} value={employeeDetailsFileds.blood_group} onChange={handleFileds} >
                                        {
                                            ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((group, index) =>
                                                <MenuItem key={index} value={group}>{group}</MenuItem>
                                            )
                                        }
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Nationality'
                                    disabled={!sections.personalInfo}
                                    name='nationality'
                                    value={employeeDetailsFileds.nationality}
                                    onChange={handleFileds}
                                />


                            </Stack>

                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Spouse Name'
                                    disabled={!sections.personalInfo || employeeDetailsFileds.marital_status !== 'married'}
                                    name='spouse_name'
                                    value={employeeDetailsFileds.spouse_name}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Number Of Childrens'
                                    disabled={!sections.personalInfo || employeeDetailsFileds.marital_status !== 'married'}
                                    type='number'
                                    inputProps={{ min: 0 }}
                                    name='number_of_childrens'
                                    value={employeeDetailsFileds.number_of_childrens}
                                    onChange={handleFileds}
                                />
                            </Stack>

                        </Stack>
                    </Container>
                </Paper>

                <Paper sx={{ m: 2 }}>
                    <Container sx={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                        <Typography variant='p' component={'h3'}>Contact Info</Typography>
                        {
                            !sections.contactInfo ?
                                <IconButton size='small' onClick={() => setSections({ ...sections, contactInfo: true })} >
                                    <Edit />
                                </IconButton>
                                :
                                <IconButton size='small' onClick={() => setSections({ ...sections, contactInfo: false })}>
                                    <Close />
                                </IconButton>
                        }
                    </Container>


                    <Container sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                size='small'
                                label='Office Email'
                                disabled
                                type='email'
                                name='office_email'
                                value={employeeDetailsFileds.office_email}
                                onChange={handleFileds}
                            />
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>

                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Personal Email'
                                    type='email'
                                    disabled={!sections.contactInfo}
                                    name='personal_email'
                                    value={employeeDetailsFileds.personal_email}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    type='tel'
                                    label='Mobile Number'
                                    disabled={!sections.contactInfo}
                                    name='mobile_number'
                                    value={employeeDetailsFileds.mobile_number}
                                    onChange={handleFileds}
                                />


                            </Stack>
                            <TextField
                                fullWidth
                                size='small'
                                label='Permanent Address'
                                multiline
                                minRows={3}
                                maxRows={3}
                                disabled={!sections.contactInfo}
                                inputProps={{ maxLength: 299 }}
                                name='permanent_address'
                                value={employeeDetailsFileds.permanent_address}
                                onChange={handleFileds}

                            />
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>


                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Zip Code'
                                    type='number'
                                    inputProps={{ min: 0 }}
                                    disabled={!sections.contactInfo}
                                    name='zip_code'
                                    value={employeeDetailsFileds.zip_code}
                                    onChange={e => e.target.value.length <= 6 && setEmployeeDetailsFileds({ ...employeeDetailsFileds, zip_code: e.target.value })}

                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='City'
                                    disabled={!sections.contactInfo}
                                    name='city'
                                    value={employeeDetailsFileds.city}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='State'
                                    disabled={!sections.contactInfo}
                                    name='state'
                                    value={employeeDetailsFileds.state}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Country'
                                    disabled={!sections.contactInfo}
                                    name='country'
                                    value={employeeDetailsFileds.country}
                                    onChange={handleFileds}
                                />

                            </Stack>

                        </Stack>
                    </Container>
                </Paper>
            </>
        )
    }

    const AccountsDetails = () => {
        return (
            <>
                <Paper sx={{ m: 2 }}>
                    <Container sx={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                        <Typography variant='p' component={'h3'}>Account Info</Typography>
                        {
                            !sections.accountInfo ?
                                <IconButton size='small' onClick={() => setSections({ ...sections, accountInfo: true })} >
                                    <Edit />
                                </IconButton>
                                :
                                <IconButton size='small' onClick={() => setSections({ ...sections, accountInfo: false })}>
                                    <Close />
                                </IconButton>
                        }
                    </Container>
                    <Container sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                size='small'
                                label='Account Number'
                                disabled={!sections.accountInfo}
                                type='number'
                                inputProps={{ min: 0 }}
                                name='account_number'
                                value={employeeDetailsFileds.account_number}
                                onChange={handleFileds}

                            />
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Bank Name'
                                    disabled={!sections.accountInfo}
                                    name='bank_name'
                                    value={employeeDetailsFileds.bank_name}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Bank Branch'
                                    disabled={!sections.accountInfo}
                                    name='bank_branch'
                                    value={employeeDetailsFileds.bank_branch}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='IFSC Code'
                                    disabled={!sections.accountInfo}
                                    name='ifsc_code'
                                    value={employeeDetailsFileds.ifsc_code}
                                    onChange={handleFileds}
                                />

                            </Stack>

                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Aadhar Number'
                                    disabled={!sections.accountInfo}
                                    type='number'
                                    inputProps={{ min: 0 }}
                                    name='aadhar_number'
                                    value={employeeDetailsFileds.aaddhar_number}
                                    onChange={e => e.target.value.length <= 12 && setEmployeeDetailsFileds({ ...employeeDetailsFileds, aaddhar_number: e.target.value })}

                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Pan Number'
                                    disabled={!sections.accountInfo}
                                    name='pan_number'
                                    value={employeeDetailsFileds.pan_number}
                                    onChange={e => e.target.value.length <= 10 && setEmployeeDetailsFileds({ ...employeeDetailsFileds, pan_number: e.target.value })}
                                />
                            </Stack>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <FormControl fullWidth>
                                    <Stack direction={'row'} >
                                        <Checkbox disabled={!sections.accountInfo || checks.esiCheck} checked={checks.uanCheck} onChange={e => {
                                            setChecks({ ...checks, uanCheck: e.target.checked })
                                            setEmployeeDetailsFileds({ ...employeeDetailsFileds, esi: '' })
                                        }} />
                                        <TextField
                                            fullWidth
                                            size='small'
                                            label='UAN'
                                            disabled={!sections.accountInfo || checks.esiCheck}
                                            name='uan'
                                            value={employeeDetailsFileds.uan}
                                            onChange={handleFileds}
                                        />
                                    </Stack>
                                </FormControl>
                                <FormControl fullWidth>
                                    <Stack direction={'row'}>
                                        <Checkbox disabled={!sections.accountInfo || checks.uanCheck} checked={checks.esiCheck} onChange={e => {
                                            setChecks({ ...checks, esiCheck: e.target.checked })
                                            setEmployeeDetailsFileds({ ...employeeDetailsFileds, uan: '' })
                                        }} />
                                        <TextField
                                            fullWidth
                                            size='small'
                                            label='ESI'
                                            disabled={!sections.accountInfo || checks.uanCheck}
                                            name='esi'
                                            value={employeeDetailsFileds.esi}
                                            onChange={handleFileds}
                                        />
                                    </Stack>
                                </FormControl>


                            </Stack>
                        </Stack>


                    </Container>
                </Paper>


            </>
        )
    }

    const EducationalDetails = () => {
        return (
            <>
                <Paper sx={{ m: 2 }}>
                    <Container sx={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                        <Typography variant='p' component={'h3'}>Qualification</Typography>
                        {
                            !sections.qualification ?
                                <IconButton size='small' onClick={() => setSections({ ...sections, qualification: true })} >
                                    <Edit />
                                </IconButton>
                                :
                                <IconButton size='small' onClick={() => setSections({ ...sections, qualification: false })}>
                                    <Close />
                                </IconButton>
                        }
                    </Container>
                    <Container sx={{ p: 2 }}>
                        <Stack spacing={2}>

                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Secondary Education Percentage'
                                    disabled={!sections.qualification}
                                    type='number'
                                    inputProps={{ min: 0, step: 0.1, max: 100 }}
                                    name='secondary_education_percentage'
                                    value={employeeDetailsFileds.secondary_education_percentage}
                                    onChange={e => Number(e.target.value) >= 0 && Number(e.target.value) <= 100 ? setEmployeeDetailsFileds({ ...employeeDetailsFileds, secondary_education_percentage: e.target.value }) : null}

                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    {
                                        employeeDetailsFileds.secondary_education_percentage_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.qualification} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, secondary_education_percentage_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>

                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.secondary_education_percentage_file !== '' && typeof employeeDetailsFileds.secondary_education_percentage_file === 'string' ? employeeDetailsFileds.secondary_education_percentage_file.slice(employeeDetailsFileds.secondary_education_percentage_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.secondary_education_percentage_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.qualification} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, secondary_education_percentage_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.secondary_education_percentage_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>



                            </Stack>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Higher Secondary Education Percentage'
                                    disabled={!sections.qualification}
                                    type='number'
                                    inputProps={{ min: 0, step: 0.1, max: 100 }}
                                    name='higher_secondary_education_percentage'
                                    value={employeeDetailsFileds.higher_secondary_education_percentage}
                                    onChange={e => Number(e.target.value) >= 0 && Number(e.target.value) <= 100 ? setEmployeeDetailsFileds({ ...employeeDetailsFileds, higher_secondary_education_percentage: e.target.value }) : null}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    {
                                        employeeDetailsFileds.higher_secondary_education_percentage_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.qualification} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, higher_secondary_education_percentage_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.higher_secondary_education_percentage_file !== '' && typeof employeeDetailsFileds.higher_secondary_education_percentage_file === 'string' ? employeeDetailsFileds.higher_secondary_education_percentage_file.slice(employeeDetailsFileds.higher_secondary_education_percentage_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.higher_secondary_education_percentage_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.qualification} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, higher_secondary_education_percentage_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.higher_secondary_education_percentage_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>

                            </Stack>

                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>

                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Diploma Stream'
                                    disabled={!sections.qualification}
                                    name='diploma_stream'
                                    value={employeeDetailsFileds.diploma_stream}
                                    onChange={handleFileds}

                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Diploma Percentage'
                                    disabled={!sections.qualification}
                                    type='number'
                                    inputProps={{ min: 0, step: 0.1, max: 100 }}
                                    name='diploma_percentage'
                                    value={employeeDetailsFileds.diploma_percentage}
                                    onChange={e => Number(e.target.value) >= 0 && Number(e.target.value) <= 100 ? setEmployeeDetailsFileds({ ...employeeDetailsFileds, diploma_percentage: e.target.value }) : null}

                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    {
                                        employeeDetailsFileds.diploma_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.qualification} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, diploma_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.diploma_file !== '' && typeof employeeDetailsFileds.diploma_file === 'string' ? employeeDetailsFileds.diploma_file.slice(employeeDetailsFileds.diploma_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.diploma_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.qualification} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, diploma_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.diploma_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>
                            </Stack>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>

                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Graduation Stream'
                                    disabled={!sections.qualification}
                                    name='graduation_stream'
                                    value={employeeDetailsFileds.graduation_stream}
                                    onChange={handleFileds}

                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Graduation Percentage'
                                    disabled={!sections.qualification}
                                    type='number'
                                    inputProps={{ min: 0, step: 0.1, max: 100 }}
                                    name='graduation_percentage'
                                    value={employeeDetailsFileds.graduation_percentage}
                                    onChange={e => Number(e.target.value) >= 0 && Number(e.target.value) <= 100 ? setEmployeeDetailsFileds({ ...employeeDetailsFileds, graduation_percentage: e.target.value }) : null}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    {
                                        employeeDetailsFileds.graduation_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.qualification} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, graduation_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.graduation_file !== '' && typeof employeeDetailsFileds.graduation_file === 'string' ? employeeDetailsFileds.graduation_file.slice(employeeDetailsFileds.graduation_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.graduation_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.qualification} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, graduation_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.graduation_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>
                            </Stack>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>

                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Post Graduation Stream'
                                    disabled={!sections.qualification}
                                    name='post_graduation_stream'
                                    value={employeeDetailsFileds.post_graduation_stream}
                                    onChange={handleFileds}

                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Post Graduation Percentage'
                                    disabled={!sections.qualification}
                                    type='number'
                                    inputProps={{ min: 0, step: 0.1, max: 100 }}
                                    name='post_graduation_percentage'
                                    value={employeeDetailsFileds.post_graduation_percentage}
                                    onChange={e => Number(e.target.value) >= 0 && Number(e.target.value) <= 100 ? setEmployeeDetailsFileds({ ...employeeDetailsFileds, post_graduation_percentage: e.target.value }) : null}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    {
                                        employeeDetailsFileds.post_graduation_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.qualification} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, post_graduation_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.post_graduation_file !== '' && typeof employeeDetailsFileds.post_graduation_file === 'string' ? employeeDetailsFileds.post_graduation_file.slice(employeeDetailsFileds.post_graduation_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.post_graduation_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.qualification} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, post_graduation_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.post_graduation_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>



                            </Stack>



                        </Stack>



                    </Container>
                </Paper>

            </>

        )
    }

    const PastExperinceDetails = () => {
        return (
            <>
                <Paper sx={{ m: 2 }}>
                    <Container sx={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                        <Typography variant='p' component={'h3'}>Past Work Experience</Typography>
                        {
                            !sections.pastWorkExperience ?
                                <IconButton size='small' onClick={() => setSections({ ...sections, pastWorkExperience: true })} >
                                    <Edit />
                                </IconButton>
                                :
                                <IconButton size='small' onClick={() => setSections({ ...sections, pastWorkExperience: false })}>
                                    <Close />
                                </IconButton>
                        }
                    </Container>
                    <Container sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Past Work Experince (years)'
                                    type='number'
                                    inputProps={{ min: 0, step: 0.1 }}
                                    disabled={!sections.pastWorkExperience}
                                    name='past_exp_years'
                                    value={employeeDetailsFileds.past_exp_years}
                                    onChange={handleFileds}
                                />
                                <TextField
                                    fullWidth
                                    size='small'
                                    label='Past Work Experince Domain'
                                    disabled={!sections.pastWorkExperience}
                                    name='past_exp_domain'
                                    value={employeeDetailsFileds.past_exp_domain}
                                    onChange={handleFileds}
                                />

                            </Stack>
                            <TextField
                                fullWidth
                                size='small'
                                label='Past Work Experince Designation'
                                disabled={!sections.pastWorkExperience}
                                name='past_exp_designation'
                                value={employeeDetailsFileds.past_exp_designation}
                                onChange={handleFileds}
                            />

                            <Stack direction={'row'} spacing={{ xs: 2, lg: 2 }} alignItems={'center'} width={'100%'}>
                                <Typography component={'h4'} variant='p'>Resignation Letter:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
                                    {
                                        employeeDetailsFileds.resignation_letter_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.pastWorkExperience} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, resignation_letter_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.resignation_letter_file !== '' && typeof employeeDetailsFileds.resignation_letter_file === 'string' ? employeeDetailsFileds.resignation_letter_file.slice(employeeDetailsFileds.resignation_letter_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.resignation_letter_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.pastWorkExperience} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, resignation_letter_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.resignation_letter_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>



                            </Stack>
                            <Stack direction={'row'} spacing={{ xs: 2, lg: 4.2 }} alignItems={'center'} width={'100%'}>
                                <Typography component={'h4'} variant='p'>Appraisal Letter:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
                                    {
                                        employeeDetailsFileds.appraisal_letter_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.pastWorkExperience} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, appraisal_letter_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.appraisal_letter_file !== '' && typeof employeeDetailsFileds.appraisal_letter_file === 'string' ? employeeDetailsFileds.appraisal_letter_file.slice(employeeDetailsFileds.appraisal_letter_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.appraisal_letter_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.pastWorkExperience} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, appraisal_letter_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.appraisal_letter_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>

                            </Stack>
                            <Stack direction={'row'} spacing={{ xs: 2, lg: 8 }} alignItems={'center'} width={'100%'}>
                                <Typography component={'h4'} variant='p'>Offer Letter:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    {
                                        employeeDetailsFileds.past_exp_offer_letter_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.pastWorkExperience} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, past_exp_offer_letter_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.past_exp_offer_letter_file !== '' && typeof employeeDetailsFileds.past_exp_offer_letter_file === 'string' ? employeeDetailsFileds.past_exp_offer_letter_file.slice(employeeDetailsFileds.past_exp_offer_letter_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.past_exp_offer_letter_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.pastWorkExperience} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, past_exp_offer_letter_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.past_exp_offer_letter_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>

                            </Stack>
                            <Stack direction={'row'} spacing={{ xs: 2, lg: 11.5 }} alignItems={'center'} width={'100%'}>
                                <Typography component={'h4'} variant='p'>Payslips:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
                                    {
                                        employeeDetailsFileds.payslips_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.pastWorkExperience} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, payslips_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.payslips_file !== '' && typeof employeeDetailsFileds.payslips_file === 'string' ? employeeDetailsFileds.payslips_file.slice(employeeDetailsFileds.payslips_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.payslips_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.pastWorkExperience} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, payslips_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.payslips_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>

                            </Stack>






                        </Stack>



                    </Container>
                </Paper>

            </>

        )
    }

    const WorkDocs = () => {
        return (
            <>
                <Paper sx={{ m: 2 }}>
                    <Container sx={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                        <Typography variant='p' component={'h3'}>Work Documents</Typography>
                        {
                            !sections.workDocuments ?
                                <IconButton size='small' onClick={() => setSections({ ...sections, workDocuments: true })} >
                                    <Edit />
                                </IconButton>
                                :
                                <IconButton size='small' onClick={() => setSections({ ...sections, workDocuments: false })}>
                                    <Close />
                                </IconButton>
                        }
                    </Container>
                    <Container sx={{ p: 2 }}>
                        <Stack spacing={2}>


                            <Stack direction={'row'} spacing={{ xs: 2, lg: 6 }}>
                                <Typography component={'h4'} variant='p'>Resume:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: { lg: '34%' } }}>
                                    {
                                        employeeDetailsFileds.resume_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.workDocuments} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, resume_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.resume_file !== '' && typeof employeeDetailsFileds.resume_file === 'string' ? employeeDetailsFileds.resume_file.slice(employeeDetailsFileds.resume_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.resume_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.workDocuments} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, resume_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.resume_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>



                            </Stack>

                            <Stack direction={'row'} spacing={{ xs: 2, lg: 2 }}>
                                <Typography component={'h4'} variant='p'>Offer Letter:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: { lg: '34%' } }}>
                                    {
                                        employeeDetailsFileds.offer_letter_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.workDocuments} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, offer_letter_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.offer_letter_file !== '' && typeof employeeDetailsFileds.offer_letter_file === 'string' ? employeeDetailsFileds.offer_letter_file.slice(employeeDetailsFileds.offer_letter_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.offer_letter_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.workDocuments} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, offer_letter_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.offer_letter_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>

                            </Stack>
                            <Stack direction={'row'} spacing={{ xs: 2, lg: 8.5 }}>
                                <Typography component={'h4'} variant='p'>NDA:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: { lg: '34%' } }}>
                                    {
                                        employeeDetailsFileds.nda_file === '' ?
                                            <Button variant='contained' color='info' type="file" size="small" component="label" disabled={!sections.workDocuments} onChange={(el) =>
                                                el.target.files?.length &&
                                                setEmployeeDetailsFileds({ ...employeeDetailsFileds, nda_file: el.target.files })
                                            }  > Choose file <VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg,application/pdf" type="file" /> </Button>
                                            :
                                            <>
                                                <Stack direction={'row'} spacing={0.2} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography component={'h6'} variant='p' textAlign='right'>{employeeDetailsFileds.nda_file !== '' && typeof employeeDetailsFileds.nda_file === 'string' ? employeeDetailsFileds.nda_file.slice(employeeDetailsFileds.nda_file.lastIndexOf('\\') + 1) : 'file: ' + employeeDetailsFileds.nda_file[0].name}</Typography>
                                                    <IconButton disabled={!sections.workDocuments} onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, nda_file: '' })} color='error'>
                                                        <Cancel />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickOpen(employeeDetailsFileds.nda_file)} color='success'>
                                                        <Preview />
                                                    </IconButton>

                                                </Stack>
                                            </>
                                    }

                                </Box>

                            </Stack>






                        </Stack>



                    </Container>
                </Paper>

            </>

        )
    }

    const handleClickOpen = (file) => {
        //console.log(file,file[0], file[0].name)
        setOpen(true);
        if (file !== '' && typeof (file) === 'string') {
            setSelectedDocs([{ uri: process.env.REACT_APP_BACKEND_SERVER + file, fileName: file.slice(file.lastIndexOf('\\') + 1) }])
        }
        else {
            setSelectedDocs([{ uri: window.URL.createObjectURL(file[0]), fileName: file[0].name, }])
        }




    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDocs([{ uri: '', fileName: '', }])
    };





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
                        <Typography variant='h5' component={'h5'} m={0.5} textAlign={'center'} >Employee Details Management</Typography>
                        <Grid container spacing={2} display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} lg={11} >
                                <Paper >
                                    <Stack spacing={2} direction={'row'} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>

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


                                                value={userData.user}
                                                renderInput={(params) => <TextField fullWidth size='small' {...params} required label="Select Employee" />}
                                            />

                                        </FormControl>
                                        <Box>
                                            <Button onClick={handleSaveDetails} variant='contained'>Save</Button>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>




                            <Grid item xs={12} lg={3}>
                                <Collapse in={employeeDetailsFileds.emp_id !== ''} timeout={1000} unmountOnExit>

                                    <Paper>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 0.3 }}>
                                            {
                                                !sections.profile ?
                                                    <IconButton size='small' onClick={() => setSections({ ...sections, profile: true })} >
                                                        <Edit />
                                                    </IconButton>
                                                    :
                                                    <IconButton size='small' onClick={() => setSections({ ...sections, profile: false })}>
                                                        <Close />
                                                    </IconButton>
                                            }



                                        </Box>
                                        <Box sx={{ width: '100%', height: '100%', }}>


                                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 1 }}>


                                                <Card sx={{ maxWidth: '100%', position: 'relative', p: 2 }}>
                                                    <CardMedia
                                                        component={'img'}
                                                        image={typeof employeeDetailsFileds.passport_photo === 'string' ? (employeeDetailsFileds.passport_photo === '' ? (employeeDetailsFileds.gender === 'female' ? 'femaleavatar.png' : 'maleavatar.png') : process.env.REACT_APP_BACKEND_SERVER + employeeDetailsFileds.passport_photo) : window.URL.createObjectURL(employeeDetailsFileds.passport_photo[0])}
                                                        alt='passport photo'
                                                        height="150"
                                                        sx={{ objectFit: 'contain', }}

                                                    />

                                                    <Collapse in={sections.profile} unmountOnExit timeout={'auto'}>
                                                        <CardActions sx={{ display: 'flex', justifyContent: 'center', m: 1 }}>

                                                            {
                                                                employeeDetailsFileds.passport_photo.length === 0 ?
                                                                    <Button variant='outlined' endIcon={<UploadFile />} color='info' type="file" size="small" component="label" onChange={(el) => {
                                                                        console.log(Array.from(el.target.files), el.target.files.length)
                                                                        el.target.files?.length &&
                                                                            setEmployeeDetailsFileds({ ...employeeDetailsFileds, passport_photo: el.target.files })
                                                                    }
                                                                    }  > Choose Photo<VisuallyHiddenInput maxLength={1} accept="image/png, image/jpeg" type="file" /> </Button>
                                                                    : <Button color='error' variant='outlined' endIcon={<Cancel />} size="small" onClick={() => setEmployeeDetailsFileds({ ...employeeDetailsFileds, passport_photo: '' })}>Remove Photo</Button>

                                                            }

                                                        </CardActions>
                                                    </Collapse>





                                                </Card>
                                                <Typography variant="h6" component="p">
                                                    {employeeDetailsFileds.first_name + ' ' + employeeDetailsFileds.last_name}
                                                </Typography>
                                                <Typography color={'gray'} mb={1} variant="p" component="h5">
                                                    {employeeDetailsFileds.designation}
                                                </Typography>
                                                <Stack spacing={1.5} sx={{ p: 1 }}>
                                                    <TextField
                                                        label='Emp ID'
                                                        size='small'
                                                        disabled
                                                        fullWidth
                                                        value={employeeDetailsFileds.emp_id}

                                                    />
                                                    <TextField
                                                        value={employeeDetailsFileds.date_of_joining}
                                                        label='Date of Joining'
                                                        size='small'
                                                        disabled
                                                        fullWidth


                                                    />
                                                    <TextField
                                                        value={employeeDetailsFileds.user_type}
                                                        label='User Type'
                                                        size='small'
                                                        disabled
                                                        fullWidth


                                                    />
                                                    <TextField
                                                        value={employeeDetailsFileds.department}
                                                        label='Department'
                                                        size='small'
                                                        disabled
                                                        fullWidth


                                                    />
                                                    <TextField
                                                        value={employeeDetailsFileds.company_name}
                                                        label='Company Name'
                                                        size='small'
                                                        disabled
                                                        fullWidth


                                                    />
                                                </Stack>
                                            </Box>


                                        </Box>

                                    </Paper>
                                </Collapse>
                            </Grid>
                            <Grid item xs={12} lg={9}>
                                <Collapse in={employeeDetailsFileds.emp_id !== ''} timeout={1000} unmountOnExit>


                                    <Container sx={{ width: '100%' }}>

                                        <Box sx={{ display: 'flex', borderBottom: '1px solid gray', width: '100%' }}>
                                            <Tabs value={value} onChange={handleChange}   >
                                                <Tab wrapped label="Personal Information" value="1" />
                                                <Tab wrapped label="Account Details" value="2" />
                                                <Tab wrapped label="Educational Details" value="3" />
                                                <Tab wrapped label="Past Experince Details" value="4" />
                                                <Tab wrapped label="Work Documents" value="5" />
                                            </Tabs>
                                        </Box>


                                    </Container>
                                    <Collapse in={value === '1'} unmountOnExit timeout={'auto'} >
                                        {pernalInformation()}
                                    </Collapse>
                                    <Collapse in={value === '2'} unmountOnExit timeout={'auto'} >
                                        {AccountsDetails()}
                                    </Collapse>
                                    <Collapse in={value === '3'} unmountOnExit timeout={'auto'} >
                                        {EducationalDetails()}
                                    </Collapse>
                                    <Collapse in={value === '4'} unmountOnExit timeout={'auto'} >
                                        {PastExperinceDetails()}
                                    </Collapse>
                                    <Collapse in={value === '5'} unmountOnExit timeout={'auto'} >
                                        {WorkDocs()}
                                    </Collapse>



                                </Collapse>
                            </Grid>

                            <Grid item xs={12} lg={8}>
                                <Collapse in={employeeDetailsFileds.emp_id === ''} unmountOnExit timeout={'auto'}>

                                    <Paper elevation={24}>
                                        <Container sx={{ maxHeight: '350px', width: '100%', display: 'flex', justifyContent: 'center', }}>
                                            <img style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }} src='x0.gif' alt='Access' />
                                        </Container>
                                    </Paper>
                                </Collapse>

                            </Grid>

                        </Grid>



                    </div>
                </Box>
            </Box>
            <Container>
                <Dialog
                    open={open}
                    maxWidth='md'
                    fullWidth

                    keepMounted
                    onClose={handleClose}

                >
                    <DialogTitle>Preview</DialogTitle>
                    <DialogContent dividers>
                        <Container sx={{ display: 'flex' }}>
                            <DocViewer
                                // documents={selectedDocs.map((file) => ({
                                //     uri: window.URL.createObjectURL(file),
                                //     fileName: file.name,
                                // }))}
                                documents={selectedDocs}
                                pluginRenderers={DocViewerRenderers}
                                theme={{
                                    primary: "#5296d8",
                                    secondary: "#ffffff",
                                    tertiary: "#5296d899",
                                    textPrimary: "#ffffff",
                                    textSecondary: "#5296d8",
                                    textTertiary: "#00000099",
                                    disableThemeScrollbar: false,
                                }}


                            />
                        </Container>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>

                    </DialogActions>


                </Dialog>
            </Container>

            <Loader loader={loader} />



        </>
    )
}

export default EmployeeDetailsManagement