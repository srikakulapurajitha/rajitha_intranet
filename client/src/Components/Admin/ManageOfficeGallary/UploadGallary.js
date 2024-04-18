import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, Typography, FormControl, Stack, OutlinedInput, InputLabel, IconButton, TextField } from '@mui/material';
import { Cancel, CloudUpload, FileUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

import { useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import ClipLoader from "react-spinners/ClipLoader";
import AccessNavBar from '../../Comman/NavBar/AccessNavBar';




const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    height: '200px',

};
const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


function UploadGallary() {
    const [eventData, setEventData] = useState({
        title: '',
        date: ''

    })
    const [loadingData, setLoadingData] = useState(false)

    const fix = () => {
        setLoadingData(false)
    }

    const [files, setFiles] = useState([]);
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png']
        },
        multiple: true,
        onDrop: (acceptedFiles) => {
            // setFiles(acceptedFiles.map(file => Object.assign(file, {
            //     preview: URL.createObjectURL(file)
            // })));
            setLoadingData(true)

            acceptedFiles.forEach(async (file) => {
                Object.assign(file, {
                    preview: await convertBase64(file)

                })


            })
            //console.log(acceptedFiles)

            setFiles([...files, ...acceptedFiles])
            setTimeout(fix, 1000)


        }
    });

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                //console.log('err',error)
                reject(error);
            };
        });
    };

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const handleUploadFile = async (e) => {
        e.preventDefault()

        if (files.length === 0) {
            toast.warning('Select file(s) to upload!');
        }
        else {
            //console.log(files)
            const form = new FormData();
            form.append("eventTitle", eventData.title)
            form.append("eventDate", eventData.date)
            files.forEach(file => form.append('file', file));
            //console.log('formdata', form)
            toast.promise(axios.post('/api/uploadgallaryimages', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },

            }), {
                pending: {
                    render() {
                        return 'Adding Event Gallary'
                    }
                },
                success: {
                    render(res) {
                        handleCancel()
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
    };

    const handleCancel = () => {
        setFiles([])
        setEventData({
            title: '',
            date: ''
        })

    }

    return (

        <Box sx={{ minHeight: { xs: 'auto', lg: '100vh' }, width: { xs: '100%', md: 'auto' }, display: 'flex', backgroundColor: '#F5F5F5' }}>
           <AccessNavBar />
            <Box component="main" sx={{ width: { xs: '100%', md: 'auto', }, flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
                <div style={{ height: 'auto', width: '100%', }} >
                    <Typography variant='h5' component={'h5'} m={1} textAlign={'center'} > Upload Gallery Images</Typography>
                    <Grid container display={'flex'} justifyContent={'center'}>
                        <Grid item sm={8} xs={12} md={10} lg={10}>
                            <Paper elevation={5} sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', p: 1 }}>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', p: 1 }}>

                                    <Stack display={'flex'} direction={'column'} width={'100%'} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} >
                                        <Stack component={'form'} onSubmit={handleUploadFile} direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel size='small' required>Event Title</InputLabel>
                                                <OutlinedInput
                                                    size='small'
                                                    value={eventData.title}
                                                    required={true}
                                                    type={'text'}
                                                    label="Event Title"
                                                    placeholder='Enter Event Title'
                                                    onChange={(event) => setEventData({ ...eventData, title: event.target.value })}

                                                />
                                            </FormControl>

                                            <FormControl fullWidth variant="outlined">
                                                <TextField
                                                    type='date'
                                                    label='Event Date'
                                                    size='small'
                                                    InputLabelProps={{ shrink: true, required: true }}
                                                    required
                                                    value={eventData.date}
                                                    onChange={e => setEventData({ ...eventData, date: e.target.value })}
                                                />

                                            </FormControl>

                                            <Stack direction={'row'} spacing={2}>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 0.2 }}>
                                                    <Button color='success' size='small' type='submit' variant="contained" endIcon={<FileUpload />} >Upload </Button>
                                                </Box>



                                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 0.2 }}>
                                                    <Button color='error' size='small' variant="contained" endIcon={<Cancel />} onClick={handleCancel}>Cancel </Button>
                                                </Box>

                                            </Stack>

                                        </Stack>

                                        <FormControl fullWidth>
                                            <section sx={{ textAlign: 'center', mt: 2, width: '100%' }}>
                                                <div {...getRootProps({ style })}>
                                                    <input {...getInputProps()} />
                                                    <Typography variant="h6">Drag 'n' drop file here, or click to select file</Typography>
                                                    <CloudUpload sx={{ fontSize: { xs: 30, md: 50 } }} />
                                                </div>
                                            </section>
                                            <Typography m={1} component={'h5'} variant='p' color={'red'}>*Upload image files (.jpeg , .png)</Typography>
                                        </FormControl>

                                    </Stack>

                                    <Grid container spacing={2} mb={2}>
                                        {
                                            loadingData ?
                                                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <ClipLoader
                                                        color={'#c0c0c0'}
                                                        loading={loadingData}
                                                        speedMultiplier={0.8}
                                                        size={85}
                                                        aria-label="Loading PropagateLoader"
                                                        data-testid="loader"
                                                    />
                                                </Container>
                                                :
                                                <>

                                                    {files.map((file, index) => (
                                                        <Grid item xs={6} sm={6} md={4} lg={2} key={index}>
                                                            <Paper elevation={1} sx={{ width: '100%', height: '80px', maxWidth: { xs: '90%', sm: '80%', md: '70%', lg: '100%' }, margin: 'auto', padding: { xs: 2, md: 3, lg: 1 }, boxSizing: 'border-box', }}>
                                                                <Stack direction={'row'} height={'100%'} >

                                                                    <IconButton
                                                                        onClick={() => {
                                                                            const newFiles = [...files];
                                                                            //console.log(files, index)
                                                                            newFiles.splice(index, 1);
                                                                            setFiles(newFiles);
                                                                        }}

                                                                        sx={{ color: 'red', transform: 'translate(280%, -60%)', zIndex: 1, position: 'absolute' }}
                                                                    //sx={{position:'absolute',top:0,right:0,zIndex:1}}
                                                                    >
                                                                        <CancelIcon fontSize='small' />
                                                                    </IconButton>

                                                                    <img
                                                                        src={file.preview}
                                                                        alt={file.name}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'contain',
                                                                            display: 'inline-block',
                                                                            position: 'relative'


                                                                        }}
                                                                    />


                                                                </Stack>

                                                            </Paper>
                                                        </Grid>

                                                    ))}

                                                </>

                                        }

                                    </Grid>


                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Box>
        </Box >

    );
}

export default UploadGallary