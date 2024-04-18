import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography, Collapse } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'

import UserContext from '../../context/UserContext'

import Chart from 'react-apexcharts'
import axios from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { toast } from 'react-toastify'
import AccessNavBar from '../NavBar/AccessNavBar'



function BalanceLeaves() {
    const { userDetails } = useContext(UserContext)
    //const endRef = useRef(null);
    const [searchSelection, setSearchSelection] = useState({
        month: '',
        year: ''
    })
    const [prevSearchSelection, setPrevSearchSelection] = useState(searchSelection)
    const [attendanceData, setAttendanceData] = useState([])
    const [generatedMonthAttendance, setGeneratedMonthAttendance] = useState({
        working_days: 0,
        present_days: 0,
        approved_leaves: 0,
        unapproved_leaves: 0,
        unapproved_leaves_data: [],
        open_leaves: 0,
        new_added_leaves: 0,
        adjusted_leaves: 0,
        lop: 0,
        balance_leaves: 0
    })

    const [submitClicks, setSubmitClicks] = useState(0)
    const [monthStatistics, setMonthStatistics] = useState({
        totalWorkingDays: 0,
        presentDays: 0,
        approvedLeaves: 0,
        unapprovedLeaves: [],
        workedHrs: 0

    })
    const [balanaceSection, setBalanceSenction] = useState({
        openLeaves: 0,
        newAddedLeaves: 0,
        adjustedLeaves: 0,
        balanceLeaves: 0
    })
    const [loader, setLoader] = useState(true)
    const [displayData, setDisplayData] = useState(false)

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
        const today = new Date()
        const newDate = new Date(today.getFullYear(), today.getMonth() - 1, 26)
        const month = newDate.getMonth()
        const year = newDate.getFullYear()
        setSearchSelection({ month: month, year: year })
        setPrevSearchSelection({ month: month, year: year })

        axios.post('/api/generatedmonthattendance', { month: month, year: year, emp_id: userDetails.employee_id })
            .then(res => {
                console.log(res.data)
                const attendance = res.data.attendance
                const monthattendance = res.data.genereatedAttendance

                if (monthattendance.length !== 0) {
                    setAttendanceData(attendance)
                    setGeneratedMonthAttendance({ ...monthattendance[0], unapproved_leaves_data: attendance.filter(att => att.updated_status === 'AA' || att.updated_status === 'XA') })
                    setDisplayData(true)
                }

            })
            .catch(err => toast.error(err.response.data))


        //today<new Date(year,month,26)
        //console.log(month,year)

        // if (today<new Date(year,month,26)) {

        //     setDisplayData(true)
        //     setAttendanceData([])
        // }
        // else {
        //     const sat = [];   //Saturdays
        //     const sun = [];   //Sundays
        //     const from_date = new Date(year, month - 1, 26)
        //     const to_date = new Date(year, month, 25)

        //     let startDate = new Date(year, month - 1, 26)
        //     let totalDays = 0
        //     while (startDate <= to_date) {
        //         if (startDate.getDay() === 0) { // if Sunday
        //             sun.push(startDate.toLocaleString('en-CA').slice(0, 10));
        //           }
        //           if (startDate.getDay() === 6) { // if Saturday
        //             sat.push(startDate.toLocaleString('en-CA').slice(0, 10));
        //           }

        //           startDate.setDate(startDate.getDate() + 1);
        //         totalDays = totalDays + 1

        //     }
        //     // console.log("total days", totalDays)
        //     // console.log('sat:', sat.length, sat);
        //     // console.log('sun:', sun.length, sun);
        //     // console.log(from_date, to_date)
        //     // console.log('dates',  from_date.toLocaleString('en-CA').slice(0,10), to_date.toLocaleString('en-CA').slice(0,10))


        //     axios.post('/api/monthattendance', { emp_id: userDetails.employee_id, from_date: from_date.toLocaleString('en-CA').slice(0,10), to_date: to_date.toLocaleString('en-CA').slice(0,10) })
        //         .then(res => {
        //             //console.log(res)
        //             setDisplayData(true)
        //             if (res.data.length === totalDays) {
        //                 setAttendanceData(res.data)
        //                 const present = res.data.filter(data => data.totalhrs !== 0)
        //                 const leaves = res.data.filter(data => (data.updated_status === 'EL' || data.updated_status === 'XL'))
        //                 const abbsent = res.data.filter(data => (!sat.includes(data.pdate) && !sun.includes(data.pdate) && (( data.updated_status === 'AA'))))
        //                 //const abbsent = res.data.filter(data => data.totalhrs === 0)
        //                 //console.log(res.data.length, present.length, leaves, abbsent.length)
        //                 setLoader(false)




        //                 const attendanceData = res.data.filter(data=>data.updated_status!=='XL'&& data.updated_status!=='EL')
        //                 const hr_list = attendanceData.map(a => a.totalhrs <= 4 ? 0 : a.totalhrs)
        //                 //const hr_list = result.map(a => a.totalhrs <= 4 ? 0 :a.updated_status==='CL'?0:a.updated_status==='SL'?0: a.totalhrs)
        //                 ////console.log('list',hr_list,attendanceData)
        //                 const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
        //                 const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)

        //                 const totalWorked = ((totalhr * 60) + totalmin)
        //                 const hrs = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
        //                 //console.log('hrs:', attendanceData, hr_list, totalhr, totalmin, totalWorked,hrs)
        //                 setMonthStatistics({
        //                     totalWorkingDays: totalDays - (sat.length + sun.length),
        //                     presentDays: present.length,
        //                     approvedLeaves: leaves.length,
        //                     unapprovedLeaves: abbsent,
        //                     workedHrs:hrs
        //                 })
        //             }
        //             else {
        //                 setAttendanceData([])
        //             }

        //         })
        //         .catch((err) => toast.error(err.response.data))
        //         axios.post('/api/monthbalance', { emp_id: userDetails.employee_id,  from_date: from_date.toLocaleString('en-CA').slice(0,10), to_date: to_date.toLocaleString('en-CA').slice(0,10) })
        //         .then(res => {
        //             const balanceData = res.data
        //             // console.log(balanceData)
        //             // const open_leaves = balanceData[0].total_leaves+balanceData[0].credit+balanceData[0].debit
        //             // const balace_leaves = balanceData[balanceData.length-1].total_leaves
        //             // //const new_added_leaves = balanceData.filter(leaves=>leaves.reference==='annual leaves' || leaves.reference==='admin adjustment').map(leave=>leave.credit).reduce((accumulator, currentValue)=>accumulator + currentValue,0)
        //             // const new_added_leaves = balanceData.map(leave=>leave.credit).reduce((accumulator, currentValue)=>accumulator + currentValue,0)
        //             // const adjusted_leaves =   balanceData.map(leave=>leave.debit).reduce((accumulator, currentValue)=>accumulator + currentValue,0)
        //             // console.log('open_leaves:',open_leaves)
        //             // console.log('balace_leaves:',balace_leaves)
        //             // console.log('new_added_leaves:',new_added_leaves)
        //             // console.log('adjusted_leaves:',adjusted_leaves, monthStatistics.approvedLeaves)
        //             setBalanceSenction({
        //                 openLeaves:balanceData.open_leaves,
        //                 newAddedLeaves:balanceData.new_added_leaves,
        //                 adjustedLeaves:balanceData.adjusted_leaves,
        //                 balanceLeaves:balanceData.balance_leaves
        //             })

        //         })
        //}


    }, [userDetails.employee_id, submitClicks])

    const options = {
        chart: {

            type: "donut",
            toolbar: {
                show: false
            },
        },
        legend: false,
        labels: ['Present Days', 'Approved Leaves', 'Unapproved Leaves'],
        title: {
            text: "Month Statistics",
            // align:"center",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            label: 'Total Days',
                            show: true,
                            showAlways: true,

                            fontSize: 15,
                            color: '#f90000',
                        }
                    }
                }
            },
        },

        dataLabels: {
            enabled: false,
        },
        animate: true,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: false

            }
        }]
    }

    const areaSeries = [{
        name: 'Worked Hours',
        data: attendanceData.map(data => data.totalhrs)
    }]

    const areaOptions = {
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },

        title: {
            text: 'Attendance Analysis',
            align: 'left'
        },
        // subtitle: {
        //     text: `Total Hours Worked: ${monthStatistics.workedHrs}/${monthStatistics.presentDays*9} (worked hrs/present days hrs)`,
        //     align: 'right'
        //   },
        colors: ['#156109'],


        labels: attendanceData.map(data => new Date(data.pdate).toLocaleString(undefined, { month: 'short', day: '2-digit' })),
        xaxis: {
            type: 'date',
        },
        yaxis: {
            opposite: false,
            title: {
                text: 'Hours Present'
            }
        },
        legend: {
            horizontalAlign: 'left'
        }
    }


    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }
    const today = new Date()
    const years = [...Array(today.getFullYear() + 1 - 2000).keys()]

    const handleSelection = (e) => {
        const { name, value } = e.target
        setSearchSelection(prev => ({ ...prev, [name]: value }))

    }



    const handleSelectionSubmit = (e) => {

        e.preventDefault()

        if (searchSelection.month !== '' && searchSelection.year && (searchSelection.month !== prevSearchSelection.month || searchSelection.year !== prevSearchSelection.year)) {
            window.scrollTo(0, document.body.scrollHeight);
            axios.post('/api/generatedmonthattendance', { ...searchSelection, emp_id: userDetails.employee_id })
                .then(res => {
                    console.log(res.data)
                    const attendance = res.data.attendance
                    const monthattendance = res.data.genereatedAttendance

                    if (monthattendance.length !== 0) {
                        setAttendanceData(attendance)
                        setGeneratedMonthAttendance({ ...monthattendance[0], unapproved_leaves_data: attendance.filter(att => att.updated_status === 'AA' || att.updated_status === 'XA') })
                        setPrevSearchSelection(searchSelection)
                    }
                    else {
                        if (attendanceData.length !== 0) {
                            setAttendanceData([])
                            setGeneratedMonthAttendance({
                                working_days: 0,
                                present_days: 0,
                                approved_leaves: 0,
                                unapproved_leaves: 0,
                                unapproved_leaves_data: [],
                                open_leaves: 0,
                                new_added_leaves: 0,
                                adjusted_leaves: 0,
                                lop: 0,
                                balance_leaves: 0
                            })
                        }
                    }

                })
                .catch(err => toast.error(err.response.data))

        }
        // window.scrollTo(0, document.body.scrollHeight);
        // //endRef.current.scrollIntoView({ behavior: 'smooth' });


        // const { month, year } = searchSelection
        // const today = new Date()
        // //today<new Date(year,month,26)
        // //console.log(month,year)
        // if (today<new Date(year,month,26)) {

        //     setDisplayData(true)
        //     setAttendanceData([])
        // }
        // else {
        //     const sat = [];   //Saturdays
        //     const sun = [];   //Sundays
        //     const from_date = new Date(year, month - 1, 26)
        //     const to_date = new Date(year, month, 25)

        //     let startDate = new Date(year, month - 1, 26)
        //     let totalDays = 0
        //     while (startDate <= to_date) {
        //         if (startDate.getDay() === 0) { // if Sunday
        //             sun.push(startDate.toLocaleString('en-CA').slice(0, 10));
        //           }
        //           if (startDate.getDay() === 6) { // if Saturday
        //             sat.push(startDate.toLocaleString('en-CA').slice(0, 10));
        //           }

        //           startDate.setDate(startDate.getDate() + 1);
        //         totalDays = totalDays + 1

        //     }
        //     // console.log("total days", totalDays)
        //     // console.log('sat:', sat.length, sat);
        //     // console.log('sun:', sun.length, sun);
        //     // console.log(from_date, to_date)
        //     // console.log('dates',  from_date.toLocaleString('en-CA').slice(0,10), to_date.toLocaleString('en-CA').slice(0,10))


        //     axios.post('/api/monthattendance', { emp_id: userDetails.employee_id, from_date: from_date.toLocaleString('en-CA').slice(0,10), to_date: to_date.toLocaleString('en-CA').slice(0,10) })
        //         .then(res => {
        //             //console.log(res)
        //             setDisplayData(true)
        //             if (res.data.length === totalDays) {
        //                 setAttendanceData(res.data)
        //                 const present = res.data.filter(data => data.totalhrs !== 0)
        //                 const leaves = res.data.filter(data => (data.updated_status === 'EL' || data.updated_status === 'XL'))
        //                 const abbsent = res.data.filter(data => (!sat.includes(data.pdate) && !sun.includes(data.pdate) && (( data.updated_status === 'AA'))))
        //                 //const abbsent = res.data.filter(data => data.totalhrs === 0)
        //                 //console.log(res.data.length, present.length, leaves, abbsent.length)
        //                 setLoader(false)




        //                 const attendanceData = res.data.filter(data=>data.updated_status!=='XL'&& data.updated_status!=='EL')
        //                 const hr_list = attendanceData.map(a => a.totalhrs <= 4 ? 0 : a.totalhrs)
        //                 //const hr_list = result.map(a => a.totalhrs <= 4 ? 0 :a.updated_status==='CL'?0:a.updated_status==='SL'?0: a.totalhrs)
        //                 ////console.log('list',hr_list,attendanceData)
        //                 const totalhr = hr_list.reduce((acc, curr_value) => acc + (Math.trunc(curr_value)), 0)
        //                 const totalmin = hr_list.reduce((acc, curr_value) => acc + (curr_value % 1).toFixed(2) * 100, 0)

        //                 const totalWorked = ((totalhr * 60) + totalmin)
        //                 const hrs = (Math.trunc(totalWorked / 60) + (totalWorked % 60) / 100).toFixed(2)
        //                 //console.log('hrs:', attendanceData, hr_list, totalhr, totalmin, totalWorked,hrs)
        //                 setMonthStatistics({
        //                     totalWorkingDays: totalDays - (sat.length + sun.length),
        //                     presentDays: present.length,
        //                     approvedLeaves: leaves.length,
        //                     unapprovedLeaves: abbsent,
        //                     workedHrs:hrs
        //                 })
        //             }
        //             else {
        //                 setAttendanceData([])
        //             }

        //         })
        //         .catch((err) => toast.error(err.response.data))
        //         axios.post('/api/monthbalance', { emp_id: userDetails.employee_id,  from_date: from_date.toLocaleString('en-CA').slice(0,10), to_date: to_date.toLocaleString('en-CA').slice(0,10) })
        //         .then(res => {
        //             const balanceData = res.data
        //             // console.log(balanceData)
        //             // const open_leaves = balanceData[0].total_leaves+balanceData[0].credit+balanceData[0].debit
        //             // const balace_leaves = balanceData[balanceData.length-1].total_leaves
        //             // //const new_added_leaves = balanceData.filter(leaves=>leaves.reference==='annual leaves' || leaves.reference==='admin adjustment').map(leave=>leave.credit).reduce((accumulator, currentValue)=>accumulator + currentValue,0)
        //             // const new_added_leaves = balanceData.map(leave=>leave.credit).reduce((accumulator, currentValue)=>accumulator + currentValue,0)
        //             // const adjusted_leaves =   balanceData.map(leave=>leave.debit).reduce((accumulator, currentValue)=>accumulator + currentValue,0)
        //             // console.log('open_leaves:',open_leaves)
        //             // console.log('balace_leaves:',balace_leaves)
        //             // console.log('new_added_leaves:',new_added_leaves)
        //             // console.log('adjusted_leaves:',adjusted_leaves, monthStatistics.approvedLeaves)
        //             setBalanceSenction({
        //                 openLeaves:balanceData.open_leaves,
        //                 newAddedLeaves:balanceData.new_added_leaves,
        //                 adjustedLeaves:balanceData.adjusted_leaves,
        //                 balanceLeaves:balanceData.balance_leaves
        //             })

        //         })
        // }



    }



    return (
        <>
            <Box sx={{ height: { xs: 'auto', lg: '100%' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}  >
                <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, backgroundColor: '#F5F5F5' }}  >
                    <div

                        style={{
                            height: 'auto',
                            width: '100%',
                            backgroundColor: '#F5F5F5'


                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Balance Leaves</Typography>
                        <Grid container spacing={1} display={'flex'} justifyContent={'center'}  >
                            <Grid item xs={12} sm={12} lg={12}>
                                <Paper elevation={1} sx={{ p: 1, "&:hover": { boxShadow: 8 } }}>
                                    <Typography variant='p' component={'h5'} color={'red'}  >*Note.</Typography>
                                    <Stack spacing={0.3}>
                                        <Typography variant='p' component={'h5'} textAlign={'justify'} >* Present days is the no. of days present from last month 26th to current month 25th.</Typography>
                                        <Typography variant='p' component={'h5'} textAlign={'justify'} >* Adjusted leaves is the no. of leaves deducted from balance leaves for this month.</Typography>
                                        <Typography variant='p' component={'h5'} textAlign={'justify'} >* Unapproved leaves include all unapproved permissions/mispunches, uncompensated permissions, etc</Typography>
                                        <Typography variant='p' component={'h5'} textAlign={'justify'} >* Twice the number of unapproved leaves would be deducted from balance leaves</Typography>
                                        <Typography variant='p' component={'h5'} textAlign={'justify'} >* Leaves more than -3 would be treated as LOP</Typography>
                                        <Typography variant='p' component={'h5'} textAlign={'justify'} >* Balance leaves range between -3 to 28.</Typography>

                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={8}  >
                                <Stack component={'form'} onSubmit={handleSelectionSubmit} mt={1} direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} >
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel required size='small'>Year</InputLabel>
                                        <Select maxRows={10} MenuProps={{ style: { maxHeight: 400 } }} size='small' label='Year' name='year' value={searchSelection.year} onChange={handleSelection} required>
                                            {
                                                years.reverse().map(yearNo =>
                                                    <MenuItem key={yearNo} value={yearNo + 2000}>{yearNo + 2000}</MenuItem>
                                                )
                                            }

                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel required size='small'>Month</InputLabel>
                                        <Select size='small' label='Month' MenuProps={{ style: { maxHeight: 400 } }} name='month' value={searchSelection.month} onChange={handleSelection} required>
                                            {
                                                Object.keys(months).map(monthNo =>
                                                    <MenuItem key={monthNo} disabled={new Date().getMonth() < monthNo && new Date().getFullYear() <= searchSelection.year} value={monthNo}>{months[monthNo]}</MenuItem>
                                                )
                                            }

                                        </Select>
                                    </FormControl>
                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: "center", }} >
                                        <Button type='submit' size='small' color='success' variant='contained'>submit</Button>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={12} sx={{ minHeight: 265, scrollSnapType: 'y', scrollSnapAlign: 'end' }}   >

                            <Collapse in={attendanceData.length!==0} unmountOnExit timeout={'auto'} >

                                        <Grid container spacing={2}  >
                                            <Grid item xs={12} sm={12} lg={3.5}>
                                                <Paper elevation={1} sx={{ p: 1, "&:hover": { boxShadow: 8 }, height: { xs: 'auto', lg: 400 } }}>
                                                    {
                                                        attendanceData.length !== 0 ?
                                                            <>
                                                                <Container sx={{ display: "flex", justifyContent: 'center', height: 200 }}  >
                                                                    <Chart
                                                                        options={options}
                                                                        series={[generatedMonthAttendance.present_days, generatedMonthAttendance.approved_leaves, generatedMonthAttendance.unapproved_leaves]}
                                                                        type="donut"
                                                                        height={'100%'}

                                                                    />
                                                                </Container>
                                                                <Container>
                                                                    <Stack spacing={2}>
                                                                        <Paper>
                                                                            <Typography margin={0.8} variant='p' component={'h5'} color={'red'} textAlign={'center'} sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.2)' } }}  >Total Working Days: <span style={{ color: 'black' }}> {generatedMonthAttendance.working_days}</span></Typography>

                                                                        </Paper>
                                                                        <Paper>
                                                                            <Typography margin={0.8} variant='p' component={'h5'} color={'#2E93fA'} textAlign={'center'} sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.2)' } }}  >Present Days: <span style={{ color: 'black' }}>{generatedMonthAttendance.present_days} </span></Typography>

                                                                        </Paper>
                                                                        <Paper>
                                                                            <Typography margin={0.8} variant='p' component={'h5'} color={'#5BC138'} textAlign={'center'} sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.2)' } }}  >Approved Leaves: <span style={{ color: 'black' }}>{generatedMonthAttendance.approved_leaves}</span></Typography>

                                                                        </Paper>
                                                                        <Paper>
                                                                            <Typography margin={0.8} variant='p' component={'h5'} color={'#FF9800'} textAlign={'center'} sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.2)' } }}  >Unapproved Leaves: <span style={{ color: 'black' }}>{generatedMonthAttendance.unapproved_leaves}</span></Typography>

                                                                        </Paper>


                                                                    </Stack>
                                                                </Container>
                                                            </>
                                                            : null

                                                    }

                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} sm={12} lg={8.5}>
                                                <Paper elevation={1} sx={{ p: 1, "&:hover": { boxShadow: 8 }, width: '100%', height: { xs: 'auto', lg: 400 } }}>
                                                    <Grid container >
                                                        <Grid item xs={12} sm={12} lg={12}>
                                                            <Container sx={{ width: '100%', height: 220 }}>

                                                                <Chart
                                                                    options={areaOptions}
                                                                    series={areaSeries}
                                                                    type="area"
                                                                    height={'100%'}
                                                                    width={'100%'}
                                                                />


                                                            </Container>
                                                        </Grid>
                                                        {/* <Grid item xs={12} sm={12} lg={1} >
                                                                        <Stack spacing={1.5} direction={{xs:'row',lg:'column'}} width={'100%'}>
                                                                    <Paper sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.1)' },backgroundImage:'linear-gradient(135deg, #FFFEFF 10%, #D7FFFE 100%);'  }}>
                                                                                    <Typography margin={0.8} variant='p' component={'h6'}  textAlign={'center'}  >Total Hr's</Typography>

                                                                                </Paper>
                                                                                </Stack>
                                                                    </Grid> */}
                                                        <Grid item xs={12} sm={12} lg={8}>
                                                            <Box height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} p={1}>
                                                                <Typography fontSize={12} fontWeight={'bold'} color={'#FF9800'} m={0.5}>*Unapproved Leaves:</Typography>

                                                                <DataTable size='small' width={'100%'} scrollable scrollHeight='120px' showGridlines value={generatedMonthAttendance.unapproved_leaves_data}
                                                                    dataKey="pdate" key={'pdate'} tableStyle={{ fontSize: '10px' }} >
                                                                    <Column field="pdate" header="Date"></Column>
                                                                    <Column field="firstin" header="First In"></Column>
                                                                    <Column field="lastout" header="Last Out"></Column>
                                                                    <Column field="status" header="Status"></Column>
                                                                    <Column field="totalhrs" header="Total Hrs"></Column>
                                                                    <Column field="updated_status" header="Updated Status"></Column>

                                                                </DataTable>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} lg={4}>
                                                            <Container sx={{ height: '100%', width: '100%', }} >
                                                                <Stack spacing={0.5} display={'flex'} justifyContent={'center'} >
                                                                    <Paper sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.1)' }, backgroundImage: 'linear-gradient(135deg, #FFFEFF 10%, #D7FFFE 100%);' }}>
                                                                        <Typography margin={0.8} variant='p' component={'h5'} textAlign={'center'}    >Open Leaves: {generatedMonthAttendance.open_leaves}</Typography>

                                                                    </Paper>
                                                                    <Paper sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.1)' }, backgroundImage: 'linear-gradient(135deg, #FFFEFF 10%, #D7FFFE 100%);' }}>
                                                                        <Typography margin={0.8} variant='p' component={'h5'} textAlign={'center'}  >New Leaves Added: <span style={{ color: 'black' }}>{generatedMonthAttendance.new_leaves_added}</span></Typography>

                                                                    </Paper>
                                                                    <Paper sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.1)' }, backgroundImage: 'linear-gradient(135deg, #FFFEFF 10%, #D7FFFE 100%);' }}>
                                                                        <Typography margin={0.8} variant='p' component={'h5'} textAlign={'center'}  >Adjusted Leaves: <span style={{ color: 'black' }}>{generatedMonthAttendance.adjusted_leaves} </span></Typography>

                                                                    </Paper>
                                                                    <Paper sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.1)' }, backgroundImage: 'linear-gradient(135deg, #FFFEFF 10%, #D7FFFE 100%);' }}>
                                                                        <Typography margin={0.8} variant='p' component={'h5'} textAlign={'center'}  >Loss of Pays: <span style={{ color: 'black' }}>{generatedMonthAttendance.lop}</span></Typography>

                                                                    </Paper>
                                                                    <Paper sx={{ transition: 'transform .2s;', "&:hover": { transform: 'scale(1.1)' }, backgroundImage: 'linear-gradient(135deg, #FFFEFF 10%, #D7FFFE 100%);' }}>
                                                                        <Typography margin={0.8} variant='p' component={'h5'} textAlign={'center'}  >Balance Leaves: <span style={{ color: 'black' }}>{generatedMonthAttendance.balance_leaves}</span></Typography>

                                                                    </Paper>

                                                                </Stack>

                                                            </Container>

                                                        </Grid>


                                                    </Grid>

                                                </Paper>
                                            </Grid>
                                        </Grid>
                                        </Collapse>

                                        
                                        <Collapse in={attendanceData.length===0} unmountOnExit timeout={'auto'} >
                                        <Container sx={{ display: "flex", justifyContent: 'center', width: '90%', height: 250 }}>
                                            <Paper sx={{ width: '100%', backgroundColor: '#fafbfd' }}>
                                                <img style={{ objectFit: 'contain', height: '100%', width: '100%' }} src='norecordfound.gif' alt='no records' />


                                            </Paper>

                                        </Container>
                                        </Collapse>

                                



                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
        </>
    )
}

export default BalanceLeaves