import { Box, Typography } from '@mui/material'
import React from 'react'

function Address(props) {
    const { pageDetails } = props
    return (
        <>
            <Typography textAlign={'center'} fontSize={20} fontWeight={'bold'} pt={2}  >{pageDetails.pageName}</Typography>
            <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', border:'1px solid gray', m:2, p:1}}>
                <Typography  fontSize={25} fontWeight={'bold'} pt={2}  >{pageDetails.pageData[0]['company_name']}</Typography>
                <Typography  fontSize={15} fontWeight={'bold'}  ml={3} color={'gray'} >{pageDetails.pageData[0]['company_address']}</Typography>

            </Box>
        </>
    )
}

export default Address