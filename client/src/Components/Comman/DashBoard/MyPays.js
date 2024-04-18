import { Paper,Box,Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';


function MyPays(props) {
    const {salaryData} = props
    const navigate = useNavigate();   

    return (
          <div style={{ minHeight: '220px', overflow: 'auto' }}> 
        <Box>
            <Typography component='h4' variant='p' sx={{ p: 1, ml: 1 }}>
                Last 3 Months Transaction
            </Typography>
            
            <Container sx={{ width: '100%',maxHeight:150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center" }}>
             
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 180 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Month</TableCell>
                                <TableCell align="center">Salary</TableCell>
                                <TableCell align="center">PF</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salaryData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.uploaded_month}</TableCell>
                                    <TableCell align="center">{row.empsalnet}</TableCell>
                                    <TableCell align="center">{row.empsalepf}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Container>
            <Container sx={{ display: 'block', p: 2 }} >
                <Button onClick={()=>navigate("/payslips")} variant="contained">Pay slips</Button>
            </Container>  
        </Box>
    </div>     
    )
}

export default MyPays;