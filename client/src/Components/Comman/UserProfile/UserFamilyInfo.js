import React from 'react'
import { Container, Paper, Typography } from '@mui/material'

function UserFamilyInfo(props) {
    const { familyInfo } = props
    return (
        <Paper sx={{ display: "flex", flexDirection: 'column', minHeight: "350px", "&:hover": { boxShadow: 10 } }}>

            <Typography color={'#FF7E00'} component={'h4'} variant='p' m={0.5}>Family Information</Typography>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <table className='User-Info'>
                    <tbody>
                    <tr >
                        <td className='table-heading' >Name of the Spouse</td>
                        <td>:</td>
                        <td >{familyInfo.spouse_name === '' ? 'NA' : familyInfo.spouse_name}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>No. of Kid(s)</td>
                        <td>:</td>
                        <td>{familyInfo.no_of_kids === '' ? 'NA' : familyInfo.no_of_kids}</td>

                    </tr>
                    <tr >
                        <td className='table-heading'>Name(s) of Kid(s)</td>
                        <td>:</td>
                        <td>{familyInfo.kids_names === '' ? 'NA' : familyInfo.kids_names}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Wedding Anniversary</td>
                        <td>:</td>
                        <td>{familyInfo.anniversary_date === null ? 'NA' : familyInfo.anniversary_date}</td>

                    </tr>

                    <tr>
                        <td className='table-heading'>Blood Group</td>
                        <td>:</td>
                        <td>{familyInfo.blood_group === '' ? 'NA' : familyInfo.blood_group}</td>

                    </tr>

                    </tbody>

                    

                </table>

            </Container>
        </Paper>
    )
}

export default UserFamilyInfo