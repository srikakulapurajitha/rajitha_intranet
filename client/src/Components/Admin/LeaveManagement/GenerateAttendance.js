import { Box, Button, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, Switch, Typography, styled, Collapse, IconButton, Fade } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'
import { Delete, FileDownload, ModelTraining } from '@mui/icons-material'
import { toast } from 'react-toastify';
import axios from 'axios';
//import DataTable, { defaultThemes } from 'react-data-table-component'
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import swal from 'sweetalert'


const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('file.png')  `,
                backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '60%',



            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: 'white',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '90%',
            backgroundImage: `url('generate.png')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

// const baseStyle = {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "20px",
//     borderWidth: 2,
//     borderRadius: 2,
//     borderColor: "#eeeeee",
//     borderStyle: "dashed",
//     backgroundColor: "#fafafa",
//     color: "#bdbdbd",
//     outline: "none",
//     transition: "border .24s ease-in-out",
//     height: "200px",
// };

// const focusedStyle = {
//     borderColor: "#2196f3",
// };

// const acceptStyle = {
//     borderColor: "#00e676",
// };

// const rejectStyle = {
//     borderColor: "#ff1744",
// };

// const customStyles = {
//     header: {
//         style: {
//             minHeight: '56px',
//         },
//     },
//     headRow: {
//         style: {
//             borderTopStyle: 'solid',
//             borderTopWidth: '1px',
//             borderTopColor: defaultThemes.default.divider.default,
//         },
//     },
//     headCells: {
//         style: {
//             fontSize: '14px',
//             '&:not(:first-of-type)': {
//                 borderRightStyle: 'solid',
//                 borderRightWidth: '1px',
//                 borderRightColor: defaultThemes.default.divider.default,
//                 borderLeftStyle: 'solid',
//                 borderLeftWidth: '1px',
//                 borderLeftColor: defaultThemes.default.divider.default,
//             },
//             '&:not(:last-of-type)': {
//                 borderRightStyle: 'solid',
//                 borderRightWidth: '1px',
//                 borderRightColor: defaultThemes.default.divider.default,
//                 borderLeftStyle: 'solid',
//                 borderLeftWidth: '1px',
//                 borderLeftColor: defaultThemes.default.divider.default,
//             },
//         },
//     },
//     cells: {
//         style: {
//             fontSize: '14px',
//             '&:not(:first-of-type)': {
//                 borderRightStyle: 'solid',
//                 borderRightWidth: '1px',
//                 borderRightColor: defaultThemes.default.divider.default,
//                 borderLeftStyle: 'solid',
//                 borderLeftWidth: '1px',
//                 borderLeftColor: defaultThemes.default.divider.default,
//             },
//             '&:not(:last-of-type)': {
//                 borderRightStyle: 'solid',
//                 borderRightWidth: '1px',
//                 borderRightColor: defaultThemes.default.divider.default,
//                 borderLeftStyle: 'solid',
//                 borderLeftWidth: '1px',
//                 borderLeftColor: defaultThemes.default.divider.default,
//             },
//         },
//     },
// };

const IOSSwitch = styled((props) => (
    <Switch title='Enable/Disable Attendance to All' size='small' focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 38,
    height: 22,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 17,
        height: 17,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));


const columns = [
    {
        name: "Emp Id",
        selector: (row) => row.emp_id,
        center: true,
        sortable: true
    },

    {
        name: "Employee Name",
        selector: (row) => row.emp_name,
        center: true,

    },

    {
        name: "Present Days",
        selector: (row) => row.present_days,
        center: true,
    },
    {
        name: "Absent Days",
        selector: (row) => row.absent_days,
        center: true,
    },
    {
        name: "Appr Leaves",
        selector: (row) => row.approved_leaves,
        center: true,
    },
    {
        name: "Unappr Leaves",
        selector: (row) => row.unapproved_leaves,
        center: true,
    },
    {
        name: "Open Leaves",
        selector: (row) => row.open_leaves,
        center: true,
    },
    {
        name: "New Added Leaves",
        selector: (row) => row.new_leaves_added,
        center: true,
    }, {
        name: "Adjusted Leaves",
        selector: (row) => row.adjusted_leaves,
        center: true,
    }, {
        name: "LOP",
        selector: (row) => row.lop,
        center: true,
    }, {
        name: "Balance Leaves",
        selector: (row) => row.balance_leaves,
        center: true,
    },
];

function GenerateAttendance() {
    const [mode, setMode] = useState('generate')
    const [generateSelection, setGenerateSelection] = useState({
        month: '',
        year: '',
        sixDaysWorkingDays: '',
        fiveDaysWorkingDays: ''
    })
    const [viewSelection, setViewSelection] = useState({
        month: '',
        year: '',

    })
    const [monthInfo, setmonthInfo] = useState({
        total: 0,
        sun: 0,
        sat: 0
    })

    const [atteandanceData, setAttendanceData] = useState([])

    useEffect(() => {
        if (generateSelection.month !== '' && generateSelection.year !== '') {
            const month = generateSelection.month
            const year = generateSelection.year
            const sat = [];   //Saturdays
            const sun = [];   //Sundays

            const to_date = new Date(year, month, 25)

            let startDate = new Date(year, month - 1, 26)
            let totalDays = 0
            while (startDate <= to_date) {
                if (startDate.getDay() === 0) { // if Sunday
                    sun.push(startDate.toLocaleString('en-CA').slice(0, 10));
                }
                if (startDate.getDay() === 6) { // if Saturday
                    sat.push(startDate.toLocaleString('en-CA').slice(0, 10));
                }

                startDate.setDate(startDate.getDate() + 1);
                totalDays = totalDays + 1

            }
            //console.log(sat,sun)
            setmonthInfo({ total: totalDays, sun: sun.length, sat: sat.length })
            const deduction = sun.length>sat.length?sat.length:sun.length
            setGenerateSelection({...generateSelection, fiveDaysWorkingDays:totalDays-deduction, sixDaysWorkingDays:totalDays-(sat.length+sun.length)})


        }

    }, [generateSelection])


    const months = { 0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December' }
    const today = new Date()
    const years = [...Array(today.getFullYear() + 1 - 2000).keys()].reverse()

    const handleSelection = (e) => {
        const { name, value } = e.target
        setGenerateSelection(prev => ({ ...prev, [name]: value }))

    }
    const handleViewSelection = (e) => {
        const { name, value } = e.target
        setViewSelection(prev => ({ ...prev, [name]: value }))

    }

    const handleGenerateAttendance = (e) => {
        e.preventDefault()
        toast.promise(axios.post('/api/generateattendance', generateSelection), {
            pending: {
                render() {
                    return ('Generating Attendance')
                }
            },
            success: {
                render(res) {
                    //setGenerateSelection({month: '', year: '', sixDaysWorkingDays: '',fiveDaysWorkingDays: ''})
                    //setmonthInfo({ total: 0, sun: 0, sat: 0 })
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

    const handleViewAttendance = (e) => {
        e.preventDefault()
        axios.post('/api/viewgeneratedattendance', viewSelection)
            .then(res => {
                //console.log(res)
                setAttendanceData(res.data)
            })
            .catch(err => {
                atteandanceData.length !== 0 && setAttendanceData([])
                toast.error(err.response.data)
            }
            )
    }

    function convertArrayOfObjectsToCSV(array) {
        let result;
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(array[0]);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }


    const handleDownloadFile = () => {
        if (atteandanceData !== null) {
            const link = document.createElement('a');
            const data = atteandanceData.map(attdata => ({ 'Emp id': attdata.emp_id, 'Account Name': attdata.emp_name, 'Working Days': attdata.working_days, 'Present Days': attdata.present_days, 'Loss of Pay': attdata.lop, 'Remark': '' }))
            let csv = convertArrayOfObjectsToCSV(data);
            if (csv == null) return;
            const filename = atteandanceData[0]['month'] + '-' + atteandanceData[0]['year'];
            if (!csv.match(/^data:text\/csv/i)) {
                csv = `data:text/csv;charset=utf-8,${csv}`;
            }
            link.setAttribute('href', encodeURI(csv));
            link.setAttribute('download', filename);
            link.click();
        }
    }

    const handleDeleteData = () => {
        swal({
            title: "Do you want to Delete Generated Attendance?",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        })
            .then((willDelete) => {
                if (willDelete) {
                    toast.promise(axios.put('/api/deletegeneratedattendance', viewSelection), {
                        pending: {
                            render() {
                                return 'Deleting  Generated Attendance'
                            }
                        },
                        success: {
                            render(res) {
                                setViewSelection({month:'', year:''})
                                setAttendanceData([])
                                //handleViewSalaryModeClear()
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
            <Box sx={{ minHeight: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
                <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: 'auto',
                            width: '100%',

                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Generate Attendance</Typography>
                        <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} sm={12} lg={11}>
                                <Paper elevation={10} sx={{ width: '100%', overflow: 'hidden' }}>
                                    <Box sx={{ width: '100%', overflowY: 'hidden' }}>
                                        <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography component={'h4'} variant='p'>{mode === 'generate' ? 'Generate Attendance' : 'View Attendance'}</Typography>
                                            <FormControlLabel
                                                control={<MaterialUISwitch sx={{ m: 1 }} onChange={e => {
                                                    setGenerateSelection({month: '', year: '', sixDaysWorkingDays: '',fiveDaysWorkingDays: ''})
                                                    setmonthInfo({ total: 0, sun: 0, sat: 0 })
                                                    setViewSelection({ month: '', year: '' })
                                                    atteandanceData.length !== 0 && setAttendanceData([])
                                                    e.target.checked ? setMode('view') : setMode('generate')
                                                }}

                                                />}
                                            //labelPlacement='start'

                                            //label={mode==='generate'?'Switch To {   View   }':'Switch To {Generate}'}
                                            />
                                        </Container>
                                        <Container sx={{ p: 2, width: '100%' }}>
                                            <Box sx={{ width: '100%' }}>
                                                <Collapse in={mode === 'generate'} timeout={'auto'} unmountOnExit>
                                                    <Stack component={'form'} onSubmit={handleGenerateAttendance} spacing={2}>
                                                        <Stack mt={1} direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} >
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel required size='small'>Year</InputLabel>
                                                                <Select maxRows={10} MenuProps={{ style: { maxHeight: 400 } }} size='small' label='Year' name='year' value={generateSelection.year} onChange={handleSelection} required>
                                                                    {
                                                                        years.map(yearNo =>
                                                                            <MenuItem key={yearNo} value={yearNo + 2000}>{yearNo + 2000}</MenuItem>
                                                                        )
                                                                    }

                                                                </Select>
                                                            </FormControl>
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel required size='small'>Month</InputLabel>
                                                                <Select size='small' label='Month' MenuProps={{ style: { maxHeight: 400 } }} name='month' value={generateSelection.month} onChange={handleSelection} required>
                                                                    {
                                                                        Object.keys(months).map(monthNo =>
                                                                            <MenuItem key={monthNo} disabled={new Date().getMonth() < monthNo && new Date().getFullYear() <= generateSelection.year} value={monthNo}>{months[monthNo]}</MenuItem>
                                                                        )
                                                                    }

                                                                </Select>
                                                            </FormControl>

                                                        </Stack>
                                                        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} >
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel required size='small'>Working days for 5-Days a week</InputLabel>
                                                                <OutlinedInput
                                                                    type='number'
                                                                    size='small'
                                                                    label='Working days for 5-Days a week'
                                                                    required
                                                                    inputProps={{ min: 1, max: 31, step: 1 }}
                                                                    name='fiveDaysWorkingDays'
                                                                    value={generateSelection.fiveDaysWorkingDays}
                                                                    disabled
                                                                    //onChange={handleSelection}
                                                                />
                                                            </FormControl>
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel required size='small'>Working days for 6-Days a week</InputLabel>
                                                                <OutlinedInput
                                                                    type='number'
                                                                    size='small'
                                                                    label='Working days for 6-Days a week'
                                                                    required
                                                                    inputProps={{ min: 1, max: 31, step: 1 }}
                                                                    name='sixDaysWorkingDays'
                                                                    value={generateSelection.sixDaysWorkingDays}
                                                                    disabled
                                                                    //onChange={handleSelection}
                                                                />
                                                            </FormControl>

                                                        </Stack>
                                                        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'flex-start'} >
                                                            <Typography component={'h6'} variant='p'  >Total Month Days: {monthInfo.total}</Typography>
                                                            <Typography component={'h6'} variant='p'>Total Month Saturdays: {monthInfo.sat}</Typography>
                                                            <Typography component={'h6'} variant='p'>Total Month Sundays: {monthInfo.sun}</Typography>

                                                        </Stack>

                                                        <Stack direction={'row'} spacing={2} display={'flex'} justifyContent={'center'} >
                                                            <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", }} >
                                                                <Button type='submit' size='small' color='success' variant='contained' endIcon={<ModelTraining />}>Genarate</Button>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                </Collapse>
                                            </Box>

                                            <Box sx={{ width: '100%' }}>

                                                <Collapse in={mode === 'view'} timeout={'auto'} unmountOnExit sx={{ width: '100%' }}>
                                                    <Stack component={'form'} onSubmit={handleViewAttendance} spacing={2}>
                                                        <Stack mt={1} direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} >
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel required size='small'>Year</InputLabel>
                                                                <Select maxRows={10} MenuProps={{ style: { maxHeight: 400 } }} size='small' label='Year' name='year' value={viewSelection.year} onChange={handleViewSelection} required>
                                                                    {
                                                                        years.map(yearNo =>
                                                                            <MenuItem key={yearNo} value={yearNo + 2000}>{yearNo + 2000}</MenuItem>
                                                                        )
                                                                    }

                                                                </Select>
                                                            </FormControl>
                                                            <FormControl fullWidth variant="outlined">
                                                                <InputLabel required size='small'>Month</InputLabel>
                                                                <Select size='small' label='Month' MenuProps={{ style: { maxHeight: 400 } }} name='month' value={viewSelection.month} onChange={handleViewSelection} required>
                                                                    {
                                                                        Object.keys(months).map(monthNo =>
                                                                            <MenuItem key={monthNo} disabled={new Date().getMonth() < monthNo && new Date().getFullYear() <= viewSelection.year} value={months[monthNo]}>{months[monthNo]}</MenuItem>
                                                                        )
                                                                    }

                                                                </Select>
                                                            </FormControl>
                                                            <FormControl fullWidth variant="outlined">
                                                                <Button color='info' variant="contained" type='submit'>View Details</Button>
                                                            </FormControl>
                                                            {
                                                                atteandanceData.length !== 0 &&
                                                                <Fade in={atteandanceData.length !== 0} timeout={1000} >
                                                                    <Stack direction={'row'} spacing={0.2}>
                                                                       
                                                                        <IconButton title='Delete Generated Attendance' color="error"  onClick={handleDeleteData}> <Delete /> </IconButton>
                                                                        {/* <FormControlLabel
                                                                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                                                                        /> */}
                                                                        <IconButton title='Download Salary Attendance Sheet' color="info" onClick={handleDownloadFile} > <FileDownload /> </IconButton>

                                                                    </Stack>
                                                                </Fade>
                                                            }



                                                        </Stack>
                                                    </Stack>

                                                    <Box height={'auto'} mt={2}>
                                                        <Collapse in={atteandanceData.length === 0} unmountOnExit timeout={'auto'}>
                                                            <Box sx={{ maxHeight: '300px', width: '100%', display: 'flex', justifyContent: 'center', }}>
                                                                <img style={{ objectFit: 'contain', width: '100%', height: 'auto' }} src='attendancereport.png' alt='attendancereport' />
                                                            </Box>
                                                        </Collapse>
                                                        <Collapse in={atteandanceData.length !== 0} unmountOnExit timeout={'auto'}>

                                                            <DataTable size='small' showGridlines value={atteandanceData}
                                                                dataKey="emp_id" tableStyle={{ width: 'auto', fontSize: "12px" }}>
                                                                <Column sortable field="emp_id" header="Emp id "></Column>

                                                                <Column field="emp_name" header="Name" ></Column>
                                                                <Column field="working_days" header="Working Days "></Column>
                                                                <Column field="present_days" header="Present Days "></Column>
                                                                <Column field="absent_days" header="Absent Days"></Column>
                                                                <Column field="approved_leaves" header="Appr Leaves"></Column>
                                                                <Column field="unapproved_leaves" header="Unappr Leaves"></Column>
                                                                <Column field="open_leaves" header="Open Leaves"></Column>
                                                                <Column field="new_leaves_added" header="New Leaves Added"></Column>
                                                                <Column field="adjusted_leaves" header="Adjusted Leaves"></Column>
                                                                <Column field="lop" header="LOP"></Column>
                                                                <Column field="balance_leaves" header="Balance Leaves"></Column>

                                                            </DataTable>
                                                        </Collapse>


                                                    </Box>


                                                </Collapse>
                                            </Box>
                                        </Container>
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

export default GenerateAttendance