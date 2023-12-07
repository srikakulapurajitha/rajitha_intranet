import { Box, Container, Paper, Typography } from '@mui/material'
import React from 'react'

function UserContactInfo(props) {
    const { contactInfo } = props
    return (
        <Paper sx={{ display: "flex", flexDirection: 'column', minHeight: "350px", "&:hover": { boxShadow: 10 } }}>

            <Typography color={'#FF7E00'} component={'h4'} variant='p' m={0.5}>Contact Information</Typography>
            <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>


                <table className='User-Info'>
                    <tbody>
                    <tr >
                        <td className='table-heading'  >Address</td>
                        <td>:</td>
                        <td >{contactInfo.address === '' ? 'NA' : contactInfo.address}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Zip Code</td>
                        <td>:</td>
                        <td>{contactInfo.zip_code === '' ? 'NA' : contactInfo.zip_code}</td>

                    </tr>
                    <tr >
                        <td className='table-heading'> Home Phone</td>
                        <td>:</td>
                        <td>{contactInfo.home_phone === '' ? 'NA' : `${contactInfo.home_phone} [EXT: ${contactInfo.home_phone_ext === '' ? 'NA' : contactInfo.home_phone_ext}] `}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Office Phone</td>
                        <td>:</td>
                        <td>{contactInfo.office_phone === '' ? 'NA' : `${contactInfo.office_phone}  EXT: ${contactInfo.office_phone_ext === '' ? 'NA' : contactInfo.office_phone_ext} `}</td>

                    </tr>

                    </tbody>
                    


                </table>


            </Container>
            <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box mr={1.5}>
                    <Typography component={'h5'} color={'#FF7E00'} textAlign={'center'} variant='p'>Mobile</Typography>

                    <table className='User-Info-Mobile'>
                        <tr >
                            <td className='table-heading-mobile'  >Mobile 1</td>

                            <td >{contactInfo.mobile1 === '' ? 'NA' : contactInfo.mobile1}</td>

                        </tr>
                        <tr>
                            <td className='table-heading-mobile'  >Mobile 2</td>

                            <td >{contactInfo.mobile2 === '' ? 'NA' : contactInfo.mobile2}</td>

                        </tr>
                        <tr>
                            <td className='table-heading-mobile'  >Mobile 3</td>

                            <td >{contactInfo.mobile3 === '' ? 'NA' : contactInfo.mobile3}</td>

                        </tr>
                        <tr>
                            <td className='table-heading-mobile'  >Mobile 4</td>

                            <td >{contactInfo.mobile4 === '' ? 'NA' : contactInfo.mobile4}</td>

                        </tr>
                        <tr>
                            <td className='table-heading-mobile'  >Mobile 5</td>

                            <td >{contactInfo.mobile5 === '' ? 'NA' : contactInfo.mobile5}</td>

                        </tr>



                    </table>

                </Box>
                <Box>
                    <Box ml={1.5} >
                        <Typography color={'#FF7E00'} component={'h5'} textAlign={'center'} variant='p' >Im's</Typography>

                        <table className='User-Info-Mobile'>
                            <tr >
                                <td className='table-heading-mobile'  >MSN</td>

                                <td >{contactInfo.msn === '' ? 'NA' : contactInfo.msn}</td>

                            </tr>
                            <tr>
                                <td className='table-heading-mobile'  >AOL</td>

                                <td >{contactInfo.aol === '' ? 'NA' : contactInfo.aol}</td>

                            </tr>
                            <tr>
                                <td className='table-heading-mobile'  >SKYPE</td>

                                <td >{contactInfo.skype === '' ? 'NA' : contactInfo.skype}</td>

                            </tr>
                            <tr>
                                <td className='table-heading-mobile'  >YAHOO</td>

                                <td >{contactInfo.yahoo === '' ? 'NA' : contactInfo.yahoo}</td>

                            </tr>
                            <tr>
                                <td className='table-heading-mobile'  >GTALK</td>

                                <td >{contactInfo.gtalk === '' ? 'NA' : contactInfo.gtalk}</td>

                            </tr>



                        </table>

                    </Box>

                </Box>

            </Container>


        </Paper>
    )
}

export default UserContactInfo