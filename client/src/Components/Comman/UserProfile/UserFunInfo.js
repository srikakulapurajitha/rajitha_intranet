import React from 'react'
import { Container, Paper, Typography } from '@mui/material'

function UserFunInfo(props) {
    const { funInfo } = props
    return (
        <Paper sx={{ display: "flex", flexDirection: 'column', minHeight: "350px", "&:hover": { boxShadow: 10 } }}>

            <Typography color={'#FF7E00'} component={'h4'} variant='p' ml={0.5}>Fun Information</Typography>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <table className='User-Info'>
                    <tbody>
                    <tr >
                        <td className='table-heading'  >Favorite Movie</td>
                        <td>:</td>
                        <td >{funInfo.favorite_movie === '' ? 'NA' : funInfo.favorite_movie}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Favorite place to travel</td>
                        <td>:</td>
                        <td>{funInfo.favorite_place === '' ? 'NA' : funInfo.favorite_place}</td>

                    </tr>
                    <tr >
                        <td className='table-heading'> Favorite sport:</td>
                        <td>:</td>
                        <td>{funInfo.favorite_sport === '' ? 'NA' : funInfo.favorite_sport}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Favorite Food</td>
                        <td>:</td>
                        <td>{funInfo.favorite_food === '' ? 'NA' : funInfo.favorite_food}</td>

                    </tr>
                    <tr >
                        <td className='table-heading'>Favorite Actor</td>
                        <td>:</td>
                        <td>{funInfo.favorite_actor === '' ? 'NA' : funInfo.favorite_actor}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Favorite Actress</td>
                        <td>:</td>
                        <td>{funInfo.favorite_actress === '' ? 'NA' : funInfo.favorite_actress}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>All time quote</td>
                        <td>:</td>
                        <td>{funInfo.quote === '' ? 'NA' : funInfo.quote}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Good Qualities</td>
                        <td>:</td>
                        <td>{funInfo.good_quality === '' ? 'NA' : funInfo.good_quality}</td>

                    </tr>
                    <tr>
                        <td className='table-heading'>Bad Qualities</td>
                        <td>:</td>
                        <td>{funInfo.bad_quality === '' ? 'NA' : funInfo.bad_quality}</td>

                    </tr>

                    </tbody>

                    


                </table>

            </Container>


        </Paper>
    )
}

export default UserFunInfo