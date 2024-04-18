import { React, useEffect, useMemo, useState } from 'react'

import { Box, Container, IconButton, Typography, ImageList, ImageListItem, Grid, Card, Stack, Button, Divider, TextField, Paper, List, ListItem, ListItemText, Drawer, DialogActions, Dialog, DialogTitle, DialogContent, FormControl, OutlinedInput, InputLabel } from '@mui/material'
import axios from 'axios';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { Cancel, CloudUpload, Delete, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Loader from '../../Comman/Loader';
import { useDropzone } from 'react-dropzone';
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


function ViewGallery() {
    const [gallaryData, setGallaryData] = useState([])
    const [filteredGallery, setFilteredGallery] = useState(gallaryData);
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewGallery, setViewGallery] = useState({})
    const [viewGalleryImages, setViewGalleryImages] = useState([])

    const [editGallery, setEditGallery] = useState({})

    const [loader, setLoader] = useState(true)
    const [update, setUpadate] = useState(0)
    const [loadingData, setLoadingData] = useState(false)
    const [files, setFiles] = useState([]);
    const [prevData, setPrevData] = useState({ eventData: {}, images: [] })

    const fix = () => {
        setLoadingData(false)
    }
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
            //setFiles(acceptedFiles)
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/viewgallery')
                //console.log(res.data)
                setGallaryData(res.data)
                setFilteredGallery(res.data)
                setLoader(false)
            }
            catch(err) {
                toast.error(err.response.data)
                setLoader(false)


            }


        }
        fetchData()
    }, [update])

    const columns = [
        {
            name: 'Event Title',
            selector: (row) => row.event_title,
            sortable: true,
            center: true,
        },
        {
            name: 'Event Date',
            selector: (row) => new Date(row.event_date).toLocaleDateString('en-CA').slice(0, 10),

            center: true,
        },


        {
            name: 'Action',
            cell: (row) => (
                <Stack display={'flex'} spacing={1} direction={'row'} height={25}>
                    <Button variant='outlined' size='small' onClick={() => handleEditButton(row)}>EDIT</Button>
                    <Divider orientation="vertical" flexItem />
                    <Button color='success' variant='outlined' size='small' onClick={() => handleViewButton(row)}>View</Button>
                </Stack>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
            minWidth: '200px',
        },
    ];

    const subHeaderViewGalleryMemo = useMemo(() => {
        const handleSearch = (e) => {
            const filteredData = gallaryData.filter((d) => (d.event_title).toLowerCase().includes(e.target.value.toLowerCase()));
            setFilteredGallery(filteredData);
        };

        return (
            <Box>
                <TextField
                    variant='outlined'
                    size='small'
                    placeholder='Search Gallery'
                    onInput={handleSearch}
                    InputProps={{ endAdornment: <Search /> }}
                />
            </Box>
        );
    }, [gallaryData]);


    //--------------------------------------edit--------------------------------------------------------------

    const handleEditButton = async (row) => {
        //console.log(row);
        setEditDialogOpen(true);
        setLoader(true)
        try {
            const res = await axios.post('/api/getgalleryimages', row)
            setEditGallery({ ...row, event_date: new Date(row.event_date).toLocaleString('en-CA').slice(0, 10) })

            //console.log(res.data)

            //console.log(res.data.map(f=>({preview:process.env.REACT_APP_BACKEND_SERVER.slice(0,-1)+(f.image).replace(`\\`,'/')})))
            setFiles(res.data.map(f => ({ preview: (f.image) })))
            setPrevData({ images: res.data.map(f => ({ preview: (f.image) })), eventData: { ...row, event_date: new Date(row.event_date).toLocaleString('en-CA').slice(0, 10) } })
            setLoader(false)


        }
        catch {
            toast.error('unable fetch data!')
            setLoader(false)
        }




        //setPrevData({...row,department:options.filter(dep=>row.department.split(',').includes(dep.value))})

    };
    const galleryEditView = useMemo(() => {


        const handleEditDialogClose = () => {
            setEditDialogOpen(false);
            setEditGallery({event_title:'',event_date:''})
            setFiles([])
            // setEditAnnouncement({
            //     id:'',
            //     company_name:'',
            //     department:[],
            //     title:'',
            //     description:'',
            //     from_date:null,
            //     to_date:'',
            //     notify:'no',
            //     companyId:''
            // })
            // setPrevData({
            //     id:'',
            //     company_name:'',
            //     department:[],
            //     title:'',
            //     description:'',
            //     from_date:null,
            //     to_date:'',
            //     notify:'no',
            //     companyId:''
            // })
        };

        const handleEdit = async (e) => {
            e.preventDefault();

            if (JSON.stringify(prevData.eventData) !== JSON.stringify(editGallery) || JSON.stringify(prevData.images) !== JSON.stringify(files)) {
                const form = new FormData();
                form.append('eventData', JSON.stringify(editGallery))
                form.append("eventTitle", editGallery.event_title)
                form.append("eventDate", editGallery.event_date)
                form.append('prevData', JSON.stringify(prevData))
                form.append('imageData', JSON.stringify(files.filter(f => f.name === undefined)))
                files.filter(f => f.name !== undefined).forEach(file => form.append('file', file))
                toast.promise(
                    axios.put(`/api/updategallery`, form,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            }
                        }),
                    {
                        pending: {
                            render() {

                                return ('Updating announcements');
                            },
                        },
                        success: {
                            render(res) {
                                handleEditDialogClose()
                                setPrevData({ images: files, eventData: editGallery })
                                setUpadate(prev => prev + 1)
                                return (res.data.data);
                            },
                        },
                        error: {
                            render(err) {
                                return (err.data.response.data);
                            },
                        },
                    }
                );

            }
            else {
                handleEditDialogClose()

            }

        }
        return (
            <>
                <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                    <DialogTitle>Edit Gallery</DialogTitle>
                    <DialogContent dividers={true} sx={{ width: '100%', overflow: 'hidden' }}>
                        <Paper
                            elevation={1}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%'

                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                    p: 1,
                                }}
                            >
                                <form id='editannouncement' onSubmit={handleEdit} >
                                    <Stack display={'flex'} direction={'column'} width={'100%'} spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} >
                                        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel size='small' required>Event Title</InputLabel>
                                                <OutlinedInput
                                                    size='small'
                                                    value={editGallery.event_title}
                                                    required={true}
                                                    type={'text'}
                                                    InputLabelProps={{ shrink: true,}}
                                                    label="Event Title"
                                                    placeholder='Enter Event Title'
                                                    onChange={(event) => setEditGallery({ ...editGallery, event_title: event.target.value })}

                                                />
                                            </FormControl>

                                            <FormControl fullWidth variant="outlined">
                                                <TextField
                                                    type='date'
                                                    label='Event Date'
                                                    size='small'
                                                    InputLabelProps={{ shrink: true, required: true }}
                                                    required
                                                    value={editGallery.event_date}
                                                    onChange={e => setEditGallery({ ...editGallery, event_date: e.target.value })}
                                                />

                                            </FormControl>

                                        </Stack>
                                        <FormControl fullWidth>
                                            <section sx={{ textAlign: 'center', mt: 2, width: '100%' }}>
                                                <div {...getRootProps({ style })}>
                                                    <input {...getInputProps()} />
                                                    <Typography variant="h6">Drag 'n' drop file here, or click to select file</Typography>
                                                    <CloudUpload sx={{ fontSize: { xs: 30, md: 50 } }} />
                                                </div>
                                            </section>
                                            <Typography mb={2} component={'h5'} variant='p' color={'red'}>*Upload image files (.jpeg , .png)</Typography>
                                        </FormControl>
                                    </Stack>

                                    <Grid container spacing={2} mb={2} sx={{ overflow: 'auto', maxHeight: 100, }}>
                                        {
                                            loadingData ?
                                                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <ClipLoader
                                                        color={'#c0c0c0'}
                                                        loading={loadingData}
                                                        speedMultiplier={0.8}
                                                        size={65}
                                                        aria-label="Loading PropagateLoader"
                                                        data-testid="loader"
                                                    />
                                                </Container>
                                                :
                                                <>

                                                    {files.map((file, index) => (
                                                        <Grid item xs={6} sm={6} md={4} lg={2} key={index} >

                                                            <Paper elevation={1} sx={{ width: '100%', height: '80px', margin: 'auto', padding: { xs: 2, md: 3, lg: 1 }, backgroundImage: `${file.name === undefined ? `url(${process.env.REACT_APP_BACKEND_SERVER + file.preview.replace(/ /g,'%20').replace(/\\/g, '/')})` : `url(${file.preview})`}`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '100%', boxSizing: 'border-box', }}>


                                                                <IconButton
                                                                    onClick={() => {
                                                                        const newFiles = [...files];
                                                                        //console.log(files, index)
                                                                        newFiles.splice(index, 1);
                                                                        setFiles(newFiles);
                                                                    }}
                                                                    size='small'

                                                                    //sx={{ color: 'red', transform: 'translate(-60%, -60%)', zIndex: 1, position: 'absolute' }}
                                                                    sx={{ position: 'sticky', transform: 'translate(-70%, -70%)', color: 'red',zIndex: 1 }}
                                                                >
                                                                    <Cancel fontSize='5px'  />
                                                                </IconButton>
                                                            </Paper>
                                                        </Grid>

                                                    ))}
                                                </>
                                        }
                                    </Grid>
                                </form>
                            </Box>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button color='error' onClick={handleEditDialogClose}>
                            Cancel
                        </Button>
                        <Button color='success' type='submit' form='editannouncement'>
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }, [editDialogOpen, getInputProps, getRootProps, style, files, loadingData, editGallery, prevData]);

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    // Handling selected row operation
    const contextActions = useMemo(() => {
        const handleDelete = async () => {

            toast.promise(
                axios.post(`/api/deletegallery`, { id: selectedRows.map((details) => details.id), path: selectedRows.map((details) => details.gallery_path) }),
                {
                    pending: {
                        render() {
                            return ('Deleting Gallery');
                        },
                    },
                    success: {
                        render(res) {
                            setToggleCleared(!toggleCleared);
                            setUpadate(prev => prev + 1)
                            return (res.data.data)
                        },
                    },
                    error: {
                        render(err) {
                            return (err.data.response.data)
                        },
                    },
                }
            );
        }

        return (
            <Button size='medium' key='delete' variant='contained' color='error' onClick={handleDelete} startIcon={<Delete />}>
                Delete
            </Button>
        );
    }, [selectedRows, toggleCleared]);


    // Handling view button
    const handleViewButton = async (row) => {
        setViewDrawerOpen(true);
        //setEditAnnouncement(row);
        setLoader(true)
        try {

            const res = await axios.post('/api/getgalleryimages', row)
            setViewGalleryImages(res.data)
            setLoader(false)


        }
        catch {
            toast.error('unable fetch data!')
            setLoader(false)
        }

        setViewGallery(row);
    };

    // Details view
    const gallarytDetailView = useMemo(() => {
        //console.log(viewDrawerOpen)
        const handleViewButtonDrawerToggleClosing = () => {
            setViewDrawerOpen(!viewDrawerOpen);
            setViewGallery({});
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
                        marginTop: 6,
                    },
                }}
            >
                <div style={{ height: '90vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: { xs: '35ch', md: '35ch' }, minHeight: { xs: '55ch', sm: '55ch', md: '55ch' } }}>

                        <Typography variant='h5' component={'h5'} m={1} p={1} border={'1px solid black'} >Details</Typography>

                        <List sx={{ width: '100%', display: "flex", margin: 0, flexDirection: 'column' }}>

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
                                                Event Title:
                                            </Typography>
                                            {viewGallery.event_title}
                                        </>
                                    }
                                />
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
                                                Event Date:
                                            </Typography>
                                            {new Date(viewGallery.event_date).toLocaleString('en-CA').slice(0, 10)}
                                        </>
                                    }
                                />
                            </ListItem>


                        </List>
                        <Box>
                            <Typography component={'h4'} variant='p' ml={2}>Gallery Photos</Typography>
                            <ImageList sx={{ width: '100%', height: 250, p: 1 }} cols={2} rowHeight={164} gap={8} >
                                {viewGalleryImages.map((item) => (
                                    <ImageListItem key={item.image} >
                                        <img
                                            srcSet={`${process.env.REACT_APP_BACKEND_SERVER}${item.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${process.env.REACT_APP_BACKEND_SERVER}${item.image}?w=164&h=164&fit=crop&auto=format`}
                                            style={{ objectFit: 'fill' }}
                                            alt={item.no}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>

                        </Box>
                    </Paper>
                </div>

            </Drawer>
        );
    }, [viewDrawerOpen, viewGallery, viewGalleryImages]);

    return (
        <>
            <Box sx={{ height: { xs: 'auto', lg: '100vh' }, width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
               <AccessNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5, ml: { xs: 2 }, height: 'auto', backgroundColor: '#F5F5F5' }}>
                    <div
                        style={{
                            height: 'auto',
                            width: '100%',

                        }}
                    >
                        <Typography variant='h5' component={'h5'} m={0.5} textAlign={'center'} >View Gallery</Typography>
                        <Grid container display={'flex'} justifyContent={'center'}>
                            <Grid item xs={12} sm={12} lg={12}>
                                <div style={{ height: '400px', width: '95%' }}>
                                    <Card>
                                        <DataTable
                                            title=' '
                                            fixedHeader={true}
                                            fixedHeaderScrollHeight='250px'
                                            columns={columns}
                                            data={filteredGallery}
                                            selectableRows
                                            contextActions={contextActions}
                                            onSelectedRowsChange={handleRowSelected}
                                            clearSelectedRows={toggleCleared}
                                            pagination
                                            dense
                                            subHeader
                                            subHeaderComponent={subHeaderViewGalleryMemo}
                                            customStyles={customStyles}
                                        />
                                    </Card>
                                </div>
                                
                            </Grid>
                        </Grid>
                    </div>
                </Box>
                {gallarytDetailView}
                {galleryEditView}

            </Box>
            <Loader loader={loader} />
        </>

    )
}

export default ViewGallery