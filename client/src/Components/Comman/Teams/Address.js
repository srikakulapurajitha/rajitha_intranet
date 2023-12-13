import { Business } from '@mui/icons-material'
import { Box, Container, Typography } from '@mui/material'
import React from 'react'

function Address(props) {
    const { pageDetails } = props
    return (
        <>
            <Container sx={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                <Typography textAlign={'center'} component={'p'} variant='p' fontSize={20} fontWeight={'bold'}>{pageDetails.pageName}</Typography>
                <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', width: "100%", height: '70%', border: '1px solid gray', m: 2, p: 1 }}>
                    <Business sx={{ fontSize: 80, mt: 1, mb: 0 }} />
                    <Typography fontSize={25} fontWeight={'bold'}   >{pageDetails.pageData[0]['company_name']}</Typography>
                    <Typography fontSize={15} fontWeight={'bold'} ml={3} color={'#4B4B4B'} >{pageDetails.pageData[0]['company_address']}</Typography>

                    <table style={{ borderCollapse: 'collapse', margin: '20px', width: '60%' }} >
                        <tbody>

                            <tr >
                                <td className='table-heading-mobile '>Mail</td>
                                <td>:</td>
                                <td>{pageDetails.pageData[0]['company_email']}</td>
                            </tr>
                            <tr>
                                <td className='table-heading-mobile '>Phone</td>
                                <td>:</td>
                                <td>{pageDetails.pageData[0]['company_contact_no']}</td>
                            </tr>
                            <tr>
                                <td className='table-heading-mobile '>Website</td>
                                <td>:</td>
                                <td>{pageDetails.pageData[0]['company_website']}</td>
                            </tr>
                        </tbody>
                    </table>
                </Box>

            </Container>

        </>
    )
}

export default Address