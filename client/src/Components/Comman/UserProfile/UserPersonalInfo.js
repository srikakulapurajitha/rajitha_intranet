import { Container, Paper, Typography } from '@mui/material'
import React from 'react'

function UserPersonalInfo(props) {
    const {personalInfo} = props
    return (
        <Paper sx={{ display: "flex", flexDirection: 'column', minHeight: "350px", "&:hover": { boxShadow: 10 } }}>

            <Typography color={'#FF7E00'} component={'h4'} variant='p' m={0.5}>Personal Information</Typography>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <table className='User-Info'>
                    <tbody>
                    <tr >
                        <td className='table-heading'  >Email</td>
                        <td>:</td>
                        <td >{personalInfo.email === '' ? 'NA' : personalInfo.email}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Company Name</td>
                        <td>:</td>
                        <td>{personalInfo.company_name === '' ? 'NA' : personalInfo.company_name}</td>

                    </tr>
                    <tr >
                        <td className='table-heading'> Gender</td>
                        <td>:</td>
                        <td>{personalInfo.gender === '' ? 'NA' : personalInfo.gender}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Birth Day</td>
                        <td>:</td>
                        <td>{personalInfo.date_of_birth === '' ? 'NA' : personalInfo.date_of_birth}</td>

                    </tr>
                    <tr >
                        <td className='table-heading'>Country</td>
                        <td>:</td>
                        <td>{personalInfo.country === '' ? 'NA' : personalInfo.country}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>More Info</td>
                        <td>:</td>
                        <td>{personalInfo.about_yourself === '' ? 'NA' : personalInfo.about_yourself}</td>

                    </tr>

                    </tbody>

                    

                </table>

            </Container>


        </Paper>
    )
}

export default UserPersonalInfo