import { ArrowBack, Collections, KeyboardDoubleArrowRight, Search } from '@mui/icons-material'
import { Box, Button, Container, Fade, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, InputAdornment, InputLabel, OutlinedInput, Paper, Typography, createTheme, useMediaQuery } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader';
import { toast } from 'react-toastify';


const theme = createTheme()


function OfficeGallery() {
    const [galleryData, setGalleryData] = useState([])
    const [filterGalleryData, setFilterGalleryData] = useState([])
    const [galleryImages, setGalleryImages] = useState([])
    const [eventTitle, setEventTitle] = useState('')
    const [step, setStep] = useState(0)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/getofficegalleries')
                //console.log(res.data)
                setGalleryData(res.data)
                setFilterGalleryData(res.data)
                setLoader(false)
            }
            catch(err) {
                setLoader(false)
                toast.err(err)
            }



        }
        fetchData()
    }, [])
    const matches = useMediaQuery(theme.breakpoints.down('sm'));


    const GalleryView = () => {
        const handleGalleryShow = async (id, title) => {
            setLoader(true)
            try {

                const result = await axios.post('/api/getgalleryimages', { id: id })
                setGalleryImages(result.data)
                setEventTitle(title)
                setStep(1)
                setLoader(false)

            }
            catch {
                setLoader(false)
            }

        }
        const handleSearch = (e) => {

            const filter = galleryData.filter(data => (data.event_title.toLowerCase()).includes(e.target.value.toLowerCase()))
            setFilterGalleryData(filter)
        }
        return (
            <Grid item xs={12} sm={12} lg={12}>
                <Container sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                    <FormControl >
                        <InputLabel size='small'>Search Gallery </InputLabel>
                        <OutlinedInput
                            label={'Search Gallery'}
                            size='small'
                            endAdornment={<InputAdornment position="end"><Search /></InputAdornment>}
                            onChange={handleSearch}

                        />
                    </FormControl>

                </Container>
                {
                    filterGalleryData.length === 0 ?
                        <Container sx={{ display: "flex", justifyContent: 'center', width: '90%', height: 250 }}>
                            <Paper sx={{ width: '100%', backgroundColor: '#fafbfd' }}>
                                <img style={{ objectFit: 'contain', height: '100%', width: '100%' }} src='norecordfound.gif' alt='no records' />


                            </Paper>

                        </Container>
                        :
                        <Box sx={{ display: 'flex', width: '100%', height: 'auto', justifyContent: 'center', }}>
                            <ImageList cols={matches ? 2 : 3} sx={{ width: '100%', height: { lg: 'auto', xs: '80vh' } }} gap={8} >

                                {filterGalleryData.map((item) => (
                                    // <Link to="/office-gallery" key={item.img}>

                                    <ImageListItem key={item.event_date} style={{ width: 'auto', height: '250px', overflowX: 'hidden' }}  >
                                        <img
                                            style={{ objectFit: 'fill', width: '100%', height: '100%' }}
                                            srcSet={`${process.env.REACT_APP_BACKEND_SERVER + item.cover_image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${process.env.REACT_APP_BACKEND_SERVER + item.cover_image}?w=164&h=164&fit=crop&auto=format`}
                                            alt={item.event_title}
                                            loading="lazy"
                                        />
                                        <ImageListItemBar

                                            title={item.event_title}
                                            subtitle={new Date(item.event_date).toLocaleString('en-CA').slice(0, 10)}
                                            actionIcon={

                                                <IconButton
                                                    onClick={() => handleGalleryShow(item.id, item.event_title)}

                                                    size='small'
                                                    sx={{ color: 'white', transition: 'transform .2s;', "&:hover": { transform: 'translateX(3px)', } }}
                                                >
                                                    <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }} >
                                                        View Gallery
                                                        <KeyboardDoubleArrowRight fontSize='small' /></Typography>
                                                </IconButton>



                                            }
                                        />
                                    </ImageListItem>

                                    // </Link>
                                ))}
                            </ImageList>



                        </Box>
                }


            </Grid>
        )

    }
    const OpenedGallleryView = () => {
        const handleBack = () => {
            setGalleryImages([])
            setEventTitle('')
            setStep(0)


        }
        return (
            <Grid item xs={12} sm={12} lg={12}>
                <Container sx={{ display: 'flex', justifyContent: 'space-between', }}>
                    <Box>
                        <Button
                            size='small'
                            sx={{ transition: 'transform .2s;', "&:hover": { transform: 'translateX(-3px)', backgroundColor: "transparent" } }}
                            onClick={handleBack}
                        >
                            <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '15px', }}><ArrowBack />Back</Typography>
                        </Button>
                    </Box>
                    <Box >
                        <Typography sx={{ fontSize: '18px', fontWeight: 'bold', p: 0.5,color:'#D4378B',borderBottom:'3px double' }}>{eventTitle}</Typography>
                    </Box>

                </Container>
                <Box sx={{ display: 'flex', width: '100%', height: 'auto', justifyContent: 'center',  }}>
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {galleryImages.map((item) => (
                            <ImageListItem key={item.no}>
                                <img
                                    srcSet={`${process.env.REACT_APP_BACKEND_SERVER + item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${process.env.REACT_APP_BACKEND_SERVER + item.image}?w=248&fit=crop&auto=format`}
                                    alt={item.no}
                                    loading="lazy"


                                />
                                <ImageListItemBar position="below" title={item.author} />
                            </ImageListItem>
                        ))
                        }
                    </ImageList>

                </Box>
            </Grid>

        )

    }
    const views = [GalleryView(), OpenedGallleryView()]
    return (
        <Box >

            <Typography variant='h5' component={'h5'} textAlign={'center'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Office Gallery <Collections /> </Typography>

            {step === 0 ? views[step] :
                <Fade in={step === 1} timeout={2000} unmountOnExit >
                    {views[step]}
                </Fade>
            }
            <Loader loader={loader} />


        </Box>


    )
}

export default OfficeGallery