import { Paper,Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'

function MyPays() {
    function createData(name, calories, fat) {
        return { name, calories, fat };
    }
    const rows = [
        createData('July', 20917, 1800),
        createData('June', 20917, 1800),
        createData('May', 20917, 1800),
    ];
    return (
        <Box >
            <Typography component='h4' variant='p' sx={{p:1,ml:1}}>
                Last 3 Months Transaction
            </Typography>
            <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center" }} >
            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Month</TableCell>
                            <TableCell align="center">Salary</TableCell>
                            <TableCell align="center">PF</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center" component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.calories}</TableCell>
                                <TableCell align="center">{row.fat}</TableCell>


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            </Container>
            <Container sx={{display:'bloack',p:2}}>
            <a href="/"  rel="noopener noreferrer"  >
                Pay slips
            </a>
            </Container>
        </Box>
    )
}

export default MyPays