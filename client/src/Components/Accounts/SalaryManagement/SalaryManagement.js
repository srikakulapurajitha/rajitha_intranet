import { Box, Button, Chip, Collapse, Container, Fade, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Typography, styled } from '@mui/material'
import React, {useMemo, useState } from 'react'

import { CloudSync, CloudUpload, Delete, Download, FileDownload, FileUpload, Search } from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import DataTable, { defaultThemes } from 'react-data-table-component'
import axios from 'axios'
import { toast } from 'react-toastify'
import * as XLSX from "xlsx";
import Loader from '../../Comman/Loader'
import swal from 'sweetalert'
import AccessNavBar from '../../Comman/NavBar/AccessNavBar'
import CryptoJS from 'crypto-js'


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
                backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '65%',



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
            backgroundImage: `url('up.png')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));


const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    height: "200px",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

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
            '&:not(:first-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
                borderLeftStyle: 'solid',
                borderLeftWidth: '1px',
                borderLeftColor: defaultThemes.default.divider.default,
            },
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
                borderLeftStyle: 'solid',
                borderLeftWidth: '1px',
                borderLeftColor: defaultThemes.default.divider.default,
            },
        },
    },
    cells: {
        style: {
            fontSize: '14px',
            '&:not(:first-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
                borderLeftStyle: 'solid',
                borderLeftWidth: '1px',
                borderLeftColor: defaultThemes.default.divider.default,
            },
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
                borderLeftStyle: 'solid',
                borderLeftWidth: '1px',
                borderLeftColor: defaultThemes.default.divider.default,
            },
        },
    },
};



function SalaryManagement() {

    const [files, setFiles] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [uploadFileFields, setUploadFileFields] = useState({ year: '', month: '' })
    const [viewDetailsFields, setViewDetailsFields] = useState({ year: '', month: '' })
    const [salaryDetails, setSalaryDetails] = useState([])
    const [filteredSalaryDetails, setFilteredSalaryDetails] = useState(salaryDetails)
    const [mode, setMode] = useState('upload')
    const [loader, setLoader] = useState(false);

    const columns = [
        {
            name: "Emp Id",
            selector: (row) => row.empid,
            center: true,
            sortable: true
        },

        {
            name: "Employee Name",
            selector: (row) => row['EMPLOYEE NAME'],
            center: true,
            minWidth: '200px'
        },

        {
            name: "Basic",
            selector: (row) => row.empsalbasic,
            center: true,
        },
        {
            name: "Gross",
            selector: (row) => row.empsalgross,
            center: true,
        },
        {
            name: "PF",
            selector: (row) => row.empsalepf,
            center: true,
        },
        {
            name: "Deductions",
            selector: (row) => row.empsaldeductions,
            center: true,
        },
        {
            name: "Net",
            selector: (row) => row.empsalnet,
            center: true,
        },
    ];

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
        useDropzone({
            accept: {

                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx", ".csv"],
                "application/vnd.ms-excel": [".xls"],
            },
            maxFiles: 1,
            onDrop: (acceptedFile) => {
                setFiles(
                    acceptedFile.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    )
                );
                if (acceptedFile) {
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(acceptedFile[0]);
                    reader.onload = (e) => {
                        prepareFile(e.target.result)
                    };
                } else {
                    //console.log("Please select your file");
                }
            },
        });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const prepareFile = (fileBuffer) => {
        if (fileBuffer !== null) {
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            setExcelData(data);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()

    }

    const handleUploadModeClear = () => {
        setUploadFileFields({ year: '', month: '' })
        setFiles([])
        setExcelData([])
    }
    const handleViewSalaryModeClear = () => {
        setViewDetailsFields(({ year: '', month: '' }))
        setSalaryDetails(null)
        setFilteredSalaryDetails(null)
    }

    const handlePayslipsUpload = (type) => {
        if (uploadFileFields.month !== '' && uploadFileFields.year !== '') {
            if (files.length === 0) {
                toast.warning('Please choose file to upload!')
            }
            else if (excelData.length === 0) {
                toast.warning('Choosen file not containing any data! ')
            }
            else {
                //console.log(excelData, uploadFileFields, type)
                toast.promise(axios.post('/api/uploadsalarydata', { ...uploadFileFields, type: type, excelData: excelData }), {
                    pending: {
                        render() {
                            return ('Adding Record')
                        }
                    },
                    success: {
                        render(res) {
                            handleUploadModeClear()
                            return (res.data.data)
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

    

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, index) => 2000 + index).reverse();
    const handleDisplayPayslip = async (e) => {
        e.preventDefault()
        setLoader(true)

        axios.post("/api/viewsalarydata", viewDetailsFields)
            .then((res) => {
                const decrypted = JSON.parse(CryptoJS.AES.decrypt(res.data,process.env.REACT_APP_DATA_ENCRYPTION_SECRETE).toString(CryptoJS.enc.Utf8))
        //console.log(decrypted)

       
        if(decrypted!==''){
            setSalaryDetails(decrypted);
            setFilteredSalaryDetails(decrypted)
           

        }
        setLoader(false)
                
            })
            .catch((err) => {
                toast.error(err.response.data);
                setLoader(false)
            });

    };

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

    const handleDownloadTemplate= ()=>{
        const link = document.createElement('a');
            const data = [ {
                
                "empid": 1,
                "MONTH": "Dec-23",
                "EMPLOYEE NAME": "X Y Z",
                "empsalorgbasic": 15000,
                "empsalorghra": 6000,
                "empsalorgconv": 1600,
                "empsalorgedu": 0,
                "empsalorgshift": 0,
                "empsaltravel": 0,
                "empsalmedical": 0,
                "empsalorgsundrycreditothers": 317,
                "emporggross": 22917,
                "empsalorgepf": 1800,
                "empsalorgesi": 0,
                "empsalorgpt": 200,
                "A0": 30,
                "B0": 30,
                "empsalbasic": 15000,
                "empsalhra": 6000,
                "empsalconv": 1600,
                "empsaledu": 0,
                "empsalshift": 0,
                "T/H": 0,
                "empsalmed": 0,
                "empsallta": 0,
                "empsalsundrycreditothers": 317,
                "empsallaptop": 0,
                "empsalinternet": 0,
                "empsalclientincentive": 0,
                "empsalincentive": 0,
                "empsalbonus": 0,
                "empsalawards": 0,
                "empsalothers": 0,
                "empsalgross": 22917,
                "empsalepf": 1800,
                "empsalesi": 0,
                "empsalpt": 200,
                "empsalitax": 0,
                "empsalsodexo": 0,
                "empsaldebitother": 0,
                "empsaldeductions": 2000,
                "empsalnet": 20917
            },]
            let csv = convertArrayOfObjectsToCSV(data);
            if (csv == null) return;
            const filename = 'Salary Uploads Templete';
            if (!csv.match(/^data:text\/csv/i)) {
                csv = `data:text/csv;charset=utf-8,${csv}`;
            }
            link.setAttribute('href', encodeURI(csv));
            link.setAttribute('download', filename);
            link.click();
        
    }

    //table header
    const subHeaderViewSalaryDetailsMemo = useMemo(() => {

        function convertArrayOfObjectsToCSV(array) {
            let result;
            const columnDelimiter = ',';
            const lineDelimiter = '\n';
            const keys = Object.keys(array[0]).slice(2,);
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

        const handleSearch = (e) => {
            if (filteredSalaryDetails !== null && salaryDetails !== null) {
                const filteredData = salaryDetails.filter(d => String(d.empid).includes(e.target.value))
                //console.log(filteredData, e.target.value, salaryDetails)
                setFilteredSalaryDetails(filteredData)
            }
        }

        const handleDownloadFile = () => {
            if (filteredSalaryDetails !== null) {
                const link = document.createElement('a');
                let csv = convertArrayOfObjectsToCSV(filteredSalaryDetails);
                if (csv == null) return;
                const filename = filteredSalaryDetails[0]['MONTH'];
                if (!csv.match(/^data:text\/csv/i)) {
                    csv = `data:text/csv;charset=utf-8,${csv}`;
                }
                link.setAttribute('href', encodeURI(csv));
                link.setAttribute('download', filename);
                link.click();
            }
        }
        const handleDeleteFile = () => {
            swal({
                title: "Do you want to Delete File?",
                icon: "warning",
                buttons: true,
                dangerMode: true,

            })
                .then((willDelete) => {
                    if (willDelete) {
                        toast.promise(axios.post('/api/deletesalartdetails', viewDetailsFields), {
                            pending: {
                                render() {
                                    return 'Deleting Salary Details'
                                }
                            },
                            success: {
                                render(res) {
                                    handleViewSalaryModeClear()
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
            <Box>
                <Stack spacing={1} direction={'row'}>
                    <TextField variant='outlined' type='number' size='small' placeholder='search employee id' onInput={handleSearch} InputProps={{ endAdornment: <Search /> }} />
                    <Fade in={filteredSalaryDetails !== null && filteredSalaryDetails.length !== 0} timeout={1000} >
                        <Stack direction={'row'} spacing={0.2}>
                            <IconButton title='Delete File' color="error" onClick={handleDeleteFile}> <Delete /> </IconButton>
                            <IconButton title='Download File' color="info" onClick={handleDownloadFile}> <FileDownload /> </IconButton>

                        </Stack>
                    </Fade>
                </Stack>

            </Box>

        );
    }, [salaryDetails, filteredSalaryDetails, viewDetailsFields]);

    return (
        <>
            <Box sx={{ minHeight: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}  >
                <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, backgroundColor: '#F5F5F5' }}  >
                    <div

                        style={{
                            height: 'auto',
                            width: '100%',
                            backgroundColor: '#F5F5F5'


                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} >Salary Management</Typography>
                        <Grid container spacing={2} display={'flex'} justifyContent={'center'}  >
                            <Grid item xs={12} sm={12} lg={12}>
                                <Paper elevation={1} sx={{ p: 1, "&:hover": { boxShadow: 8 } }}>
                                    <Container  sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
                                        <Box sx={{m:1}}>
                                        <Button variant='outlined' size='small' color='secondary' endIcon={<Download />} onClick={handleDownloadTemplate}>Download Templete</Button>
                                        </Box>
                                        <FormControlLabel
                                            control={<MaterialUISwitch sx={{ m: 1 }} onChange={e => {
                                                handleUploadModeClear()
                                                handleViewSalaryModeClear()

                                                e.target.checked ? setMode('view details') : setMode('upload')
                                            }}

                                            />}
                                            label={mode === 'upload' ? 'Switch to (View Details)' : 'Switch to (Upload File)'}
                                        />
                                    </Container>

                                    <Container>
                                        <Collapse in={mode === 'upload'} timeout={'auto'} unmountOnExit>
                                            <Box component={'form'} onSubmit={handleSubmit} >
                                                <Stack spacing={2} p={1}>

                                                    <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }} >
                                                        <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                                                            <InputLabel size="small" required>
                                                                Select Year
                                                            </InputLabel>
                                                            <Select
                                                                size="small"
                                                                label="Select Year"
                                                                name="year"

                                                                required
                                                                value={uploadFileFields.year}
                                                                onChange={e => setUploadFileFields({ ...uploadFileFields, year: e.target.value })}
                                                            >
                                                                {years.map((name, index) => (
                                                                    <MenuItem key={index} value={name}>
                                                                        {name}
                                                                    </MenuItem>
                                                                ))}

                                                            </Select>
                                                        </FormControl>
                                                        <FormControl fullWidth variant="outlined">
                                                            <InputLabel size="small" required>
                                                                Select Month
                                                            </InputLabel>
                                                            <Select
                                                                size="small"
                                                                name="month"
                                                                label='Select Month'
                                                                required
                                                                value={uploadFileFields.month}
                                                                onChange={e => setUploadFileFields({ ...uploadFileFields, month: e.target.value })}
                                                            >
                                                                <MenuItem value="January">January</MenuItem>
                                                                <MenuItem value="February">February</MenuItem>
                                                                <MenuItem value="March">March</MenuItem>
                                                                <MenuItem value="April">April</MenuItem>
                                                                <MenuItem value="May">May</MenuItem>
                                                                <MenuItem value="June">June</MenuItem>
                                                                <MenuItem value="July">July</MenuItem>
                                                                <MenuItem value="August">August</MenuItem>
                                                                <MenuItem value="September">September</MenuItem>
                                                                <MenuItem value="October">October</MenuItem>
                                                                <MenuItem value="November">November</MenuItem>
                                                                <MenuItem value="December">December</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Stack>
                                                </Stack>


                                                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', p: 1 }}>
                                                    <section>
                                                        <div {...getRootProps({ style })}>
                                                            <input {...getInputProps()} />
                                                            <h3>Drag 'n' drop file here, or click to select file</h3>
                                                            <CloudUpload sx={{ fontSize: 50 }} />
                                                        </div>
                                                        <Typography m={1} component={"h5"} variant="p" color={"red"}>
                                                            *upload excel sheets
                                                        </Typography>
                                                        <Stack
                                                            direction={"row"}
                                                            height={{ xs: 60, md: 20 }}
                                                            spacing={2}
                                                            p={1}
                                                        >
                                                            {files.length !== 0 ? (
                                                                <>
                                                                    <Typography component={"h3"} variant="p" m={1}>
                                                                        File:
                                                                    </Typography>
                                                                    <Chip
                                                                        color="success"
                                                                        label={files[0].name}
                                                                        variant="outlined"
                                                                        onDelete={() => {
                                                                            setFiles([])
                                                                            setExcelData([])
                                                                        }}
                                                                    />
                                                                </>
                                                            ) : null}
                                                        </Stack>

                                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                            <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }} >
                                                                <Button
                                                                    color="success"
                                                                    type='submit'
                                                                    variant="contained"
                                                                    endIcon={<FileUpload />}
                                                                    onClick={() => handlePayslipsUpload('upload')}
                                                                >
                                                                    Upload
                                                                </Button>
                                                                <Button
                                                                    sx={{ backgroundColor: 'rgba(197, 0, 0, 0.7)', '&:hover': { backgroundColor: 'rgba(197, 0, 0, 1)' } }}
                                                                    type='submit'
                                                                    variant="contained"
                                                                    endIcon={<CloudSync />}
                                                                    onClick={() => handlePayslipsUpload('re-upload')}
                                                                >
                                                                    Delete & Re-Upload
                                                                </Button>

                                                            </Stack>

                                                        </Box>
                                                    </section>
                                                </Box>
                                            </Box>
                                        </Collapse>

                                        <Collapse in={mode === 'view details'} timeout={'auto'} unmountOnExit>
                                            <Box component={'form'} onSubmit={handleDisplayPayslip} p={1}>
                                                <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }} >
                                                    <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                                                        <InputLabel size="small" required>
                                                            Select Year
                                                        </InputLabel>
                                                        <Select
                                                            size="small"
                                                            label="Select Year"
                                                            name="year"
                                                            required
                                                            value={viewDetailsFields.year}
                                                            onChange={e => setViewDetailsFields({ ...viewDetailsFields, year: e.target.value })}
                                                        >
                                                            {years.map((name, index) => (
                                                                <MenuItem key={index} value={name}>
                                                                    {name}
                                                                </MenuItem>
                                                            ))}

                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth variant="outlined">
                                                        <InputLabel size="small" required>
                                                            Select Month
                                                        </InputLabel>
                                                        <Select
                                                            size="small"
                                                            name="month"
                                                            label='Select Month'
                                                            required
                                                            value={viewDetailsFields.month}
                                                            onChange={e => setViewDetailsFields({ ...viewDetailsFields, month: e.target.value })}
                                                        >
                                                            <MenuItem value="January">January</MenuItem>
                                                            <MenuItem value="February">February</MenuItem>
                                                            <MenuItem value="March">March</MenuItem>
                                                            <MenuItem value="April">April</MenuItem>
                                                            <MenuItem value="May">May</MenuItem>
                                                            <MenuItem value="June">June</MenuItem>
                                                            <MenuItem value="July">July</MenuItem>
                                                            <MenuItem value="August">August</MenuItem>
                                                            <MenuItem value="September">September</MenuItem>
                                                            <MenuItem value="October">October</MenuItem>
                                                            <MenuItem value="November">November</MenuItem>
                                                            <MenuItem value="December">December</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    <FormControl fullWidth variant="outlined">
                                                        <Button color='info' variant="contained" type='submit'>View Details</Button>
                                                    </FormControl>

                                                </Stack>

                                            </Box>
                                            <Box sx={{ minHeight: '320px', mt: 1, width: '100%' }}>
                                                <Collapse in={filteredSalaryDetails === null} timeout={'auto'} unmountOnExit>
                                                    <Box sx={{ maxHeight: '300px', width: '100%', display: 'flex', justifyContent: 'center', }}>
                                                        <img style={{ objectFit: 'contain', width: '100%', height: 'auto' }} src='salaryDetails.png' alt='salaryDetails' />
                                                    </Box>
                                                </Collapse>
                                                <Collapse in={filteredSalaryDetails !== null} timeout={'auto'} unmountOnExit>
                                                    <DataTable
                                                        columns={columns}
                                                        data={filteredSalaryDetails === null ? [] : filteredSalaryDetails}
                                                        fixedHeader
                                                        fixedHeaderScrollHeight="300px"
                                                        customStyles={customStyles}
                                                        paginationRowsPerPageOptions={[10, 50, 100]}
                                                        highlightOnHover
                                                        subHeader
                                                        subHeaderComponent={subHeaderViewSalaryDetailsMemo}
                                                        pagination
                                                        dense
                                                    />
                                                </Collapse>
                                            </Box>
                                        </Collapse>
                                    </Container>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
            <Loader loader={loader} />
        </>
    )
}

export default SalaryManagement