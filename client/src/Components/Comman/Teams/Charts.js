import { Box, Container, Typography } from '@mui/material'
import React from 'react'

function Charts(props) {
    const { pageDetails } = props
    //console.log('details', pageDetails)
    return (
        <>
            <Container sx={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                <Typography textAlign={'center'} component={'p'} variant='p' fontSize={20} fontWeight={'bold'}>{pageDetails.pageName}</Typography>
                <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start',height:'70%', width: "100%", border: '1px solid gray', m: 2 }}>
                    <img src={pageDetails.pageData[0].chart_image} alt='chart' style={{height:'100%',width:'100%',objectFit:'fill',}} />
                </Box>
            </Container>
        </>

    )
}

export default Charts