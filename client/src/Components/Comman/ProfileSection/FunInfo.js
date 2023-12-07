import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext';
import axios from 'axios';

import { toast } from 'react-toastify';

function FunInfo(props) {
  

    const {funInfo, setFunInfo} =props

    const [prevData, setPrevData] = useState(funInfo)
    const { userDetails } = useContext(UserContext)

    const handleFunInfoChange = (e) => {
        const { name, value } = e.target;
        setFunInfo({ ...funInfo, [name]: value })
    };

    const handleFunInfoSubmit = (e) => {
        e.preventDefault();
        if (userDetails && JSON.stringify(prevData)!==JSON.stringify(funInfo)) {
            toast.promise(
                axios.post('/api/addfuninformation', { ...funInfo, emp_id: userDetails.employee_id }),
                {

                    pending: {
                        render() {
                            return('Adding Fun Information')
                        }
                    },
                    success: {
                        render(res) {
                            setPrevData(funInfo)
                            return(res.data.data)
                        }
                    },
                    error: {
                        render(err) {
                            return(err.data.response.data)
                        }
                    }
                }

            )

        }
    };

    return (
        <>
            <form onSubmit={handleFunInfoSubmit}>
                <Typography variant="p" component={'h5'} m={2} textAlign={'center'}> Fun Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'cenetr', }}>

                    <Container sx={{ borderRight: { xs: 'none', lg: '1px solid black' }, marginBottom: { xs: 2, sm: 2 } }}>
                        <Stack spacing={2}>

                            <TextField
                                label="Favorite Movie"
                                name="favorite_movie"
                                value={funInfo.favorite_movie}
                                onChange={handleFunInfoChange}
                                fullWidth
                                size='small'
                                inputProps={{maxLength:100}}
                            />
                            <TextField
                                label="Favorite place to travel"
                                name="favorite_place"
                                value={funInfo.favorite_place}
                                onChange={handleFunInfoChange}
                                fullWidth
                                size='small'
                                inputProps={{maxLength:100}}
                            />


                            <Stack spacing={2} direction={'row'}>
                                <TextField
                                    label="Favorite sport"
                                    name="favorite_sport"
                                    value={funInfo.favorite_sport}
                                    onChange={handleFunInfoChange}
                                    fullWidth
                                    size='small'
                                    inputProps={{maxLength:100}}
                                />
                                <TextField
                                    label="Favorite food"
                                    name="favorite_food"
                                    value={funInfo.favorite_food}
                                    onChange={handleFunInfoChange}
                                    fullWidth
                                    size='small'
                                    inputProps={{maxLength:100}}
                                />
                            </Stack>
                            <Stack spacing={2} direction={'row'}>
                                <TextField
                                    label="Favorite actor"
                                    name="favorite_actor"
                                    value={funInfo.favorite_actor}
                                    onChange={handleFunInfoChange}
                                    fullWidth
                                    size='small'
                                    inputProps={{maxLength:100}}

                                />
                                <TextField
                                    label="Favorite actress"
                                    name="favorite_actress"
                                    value={funInfo.favorite_actress}
                                    onChange={handleFunInfoChange}
                                    fullWidth
                                    size='small'
                                    inputProps={{maxLength:100}}
                                />



                            </Stack>

                        </Stack>

                    </Container>
                    <Container>
                        <Stack spacing={2.5}>

                            <TextField
                                label="Your all time quote"
                                name="quote"
                                value={funInfo.quote}
                                onChange={handleFunInfoChange}
                                fullWidth
                                size='small'
                                inputProps={{maxLength:300}}
                            />
                            <TextField
                                label="Good quality about you"
                                name="good_quality"
                                placeholder="Add your at least three good qualities"
                                value={funInfo.good_quality}
                                onChange={handleFunInfoChange}
                                multiline
                                minRows={3}
                                maxRows={3}
                                fullWidth
                                size='small'
                                inputProps={{maxLength:500}}
                            />

                            <TextField
                                label="Bad quality about you"
                                name="bad_quality"
                                placeholder='Add your at least one bad quality'
                                value={funInfo.bad_quality}
                                onChange={handleFunInfoChange}
                                fullWidth
                                size='small'
                                inputProps={{maxLength:300}}
                            />

                        </Stack>

                    </Container>

                </Box>

                
                <Stack display={'flex'} justifyContent={'center'} direction={'row'} mt={2}>
                    <Button size="small" variant="contained" color='success' type='submit' >submit</Button>
                </Stack>
            </form>
            {/* <Loader loader={loader} /> */}
        </>

    )
}

export default FunInfo