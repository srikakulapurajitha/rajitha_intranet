import React, { useEffect, useState } from 'react'
import { Box, Chip, Container, Paper, Stack, FormControl, Button, Typography, Backdrop, OutlinedInput, InputLabel } from '@mui/material'
import DataTable from 'react-data-table-component';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import AdminNavBar from '../../Comman/NavBar/AdminNavBar';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Loader from '../../Comman/Loader';

const customStyles = {
    rows: {
        style: {
            minHeight: '72px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
};

const columns = [
    {
        name: 'Emp Id',
        selector: row => row.emp_id,
        center: 'true',
        sortable: 'true'

    },
    {
        name: 'Date',
        selector: row => row.pdate,
        center: 'true',
        sortable: 'true'
    },
    {
        name: 'First In',
        selector: row => (row.firstin).toFixed(2),
        center: 'true',

    },
    {
        name: 'Last Out',
        selector: row => row.lastout.toFixed(2),
        center: 'true',
    },
    {
        name: 'Status',
        selector: row => <Chip sx={{ fontSize: 12, p: 0.2, backgroundColor: row.status === 'XX' ? '#3FA8FC' : row.status === 'XA' ? '#FF9D36' : row.status === 'WH' ? '88888882' : '#FF6868', color: 'white' }} size='small' label={row.status} />,
        center: 'true',
    },
    {
        name: 'Total Hours',
        selector: row => row.totalhrs.toFixed(2),
        center: 'true',
    },
    {
        name: 'Updated Status',
        selector: row => <Chip sx={{ fontSize: 12, p: 0.2, backgroundColor: row.updated_status === 'XX' ? '#3FA8FC' : row.updated_status === 'XA' ? '#FF9D36' : row.updated_status === 'WH' ? '88888882' : '#FF6868', color: 'white' }} size='small' label={row.updated_status} />,
        center: 'true',

    },

];


const ViewAttendance = () => {
    const [data, setData] = useState([])
    const [date, setDate] = useState({ fromDate: null, toDate: null })
    const [empId,setEmpId] = useState('')
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        axios.get('/api/viewattendance')
            .then(res => {
                let options = [{ day: 'numeric' }, { month: 'short' }, { year: 'numeric' }];
                function join(date, options, separator) {
                    function format(option) {
                        let formatter = new Intl.DateTimeFormat('en', option);
                        return formatter.format(date);
                    }
                    return options.map(format).join(separator);
                }
                const data = res.data.map(d => ({ ...d, pdate: join(new Date(d.pdate), options, '-') }))
                setLoader(false)
                setData(data)
                //console.log(res.data)
            })
            .catch(() => {
                setLoader(false)
                toast.error('unable to fetch data')
            })
    }, [])

    const subHeaderViewCompanyMemo = React.useMemo(() => {
        const handleFilterAttendace = (e) => {
            e.preventDefault()
            console.log(date)

            setLoader(true)
            axios.post(`/api/filterattendance`, {...date,emp_id:empId})
                .then(res => {
                    let options = [{ day: 'numeric' }, { month: 'short' }, { year: 'numeric' }];
                    function join(date, options, separator) {
                        function format(option) {
                            let formatter = new Intl.DateTimeFormat('en', option);
                            return formatter.format(date);
                        }
                        return options.map(format).join(separator);
                    }
                    const data = res.data.map(d => ({ ...d, pdate: join(new Date(d.pdate), options, '-') }))
                    setLoader(false)
                    setData(data)
                    //console.log(res.data)
                })
                .catch((err) => {
                    setLoader(false)
                    toast.error(err.response.data)
                })

        }
        return (
            <Box>
                <Stack component={'form'} onSubmit={handleFilterAttendace} direction={{ xs: 'column', lg: 'row' }} spacing={2} display={'flex'} justifyContent={'center'} m={2}>
                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                        <InputLabel size='small'>Employee Id</InputLabel>
                        <OutlinedInput
                            type='number'
                            size='small'
                            label='Employee Id'
                            value={empId}
                            onChange={e=>setEmpId(e.target.value)}

                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={date.fromDate ? dayjs(date.fromDate) : null}
                                onChange={e => setDate({ ...date, fromDate: e.$d.toLocaleDateString('en-CA') })}
                                slotProps={{ textField: { size: 'small', required: true } }}
                                label="From Date"
                                format='DD/MM/YYYY'
                                maxDate={date.toDate ? dayjs(date.toDate) : null}
                            // startIcon={<EventIcon />} // Calendar icon
                            />
                        </LocalizationProvider>


                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={date.toDate ? dayjs(date.toDate) : null}
                                onChange={e => setDate({ ...date, toDate: e.$d.toLocaleDateString('en-CA') })}
                                slotProps={{ textField: { size: 'small', required: true } }}
                                label="To Date"
                                format='DD/MM/YYYY'
                                minDate={date.fromDate ? dayjs(date.fromDate) : null}
                            />
                        </LocalizationProvider>


                    </FormControl>
                    <Box sx={{ p: 0.5, height: '100%' }} >
                        <Button type='submit' size='small' color='success' variant='contained'>submit</Button>
                    </Box>
                </Stack>
            </Box>

        );
    }, [date,empId]);

    return (
        <>
            <AdminNavBar />
            <Container>
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 8 } }}>

                    <Paper elevation={10} square={false} sx={{ height: 'auto' }} >

                        <DataTable
                            title={<Typography component={'h3'} variant='p'>Attendance</Typography>}
                            columns={columns}
                            data={data}
                            fixedHeader
                            fixedHeaderScrollHeight="300px"
                            customStyles={customStyles}
                            highlightOnHover
                            progressPending={loader}
                            subHeader
                            subHeaderComponent={subHeaderViewCompanyMemo}
                            pagination
                            dense
                        />
                    </Paper>
                </Box>
            </Container>
            <Loader loader={loader} /> 
        </>
    )
}

export default ViewAttendance;