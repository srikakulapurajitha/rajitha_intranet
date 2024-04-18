import { Box, Container, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Holidays(props) {
    const { pageDetails } = props
    //const [pageData, setPageData] = useState([])
    const [holidayCalender, setHolidayCalender] = useState({})
    const [holidayTitles, setHolidayTitles] = useState([])
    //console.log('details', pageDetails)

    useEffect(() => {
        if (pageDetails) {
            const pageDetailsData = pageDetails.pageData.map(data => ({ ...data, holiday_date: new Date(data.holiday_date).toLocaleString('en-CA', { day: 'numeric', month: 'short' }) }))
            const titles = Array.from(new Set(pageDetailsData.map(data => data.holidaylist_title)))
            const holidayList = {}
            titles.forEach(tit => {
                holidayList[tit] = pageDetailsData.filter(data => data.holidaylist_title === tit)
            })
            //Object.assign(titles.map(tit=>({[tit]:pageDetails.pageData.filter(data=>data.holidaylist_title===tit)})))
            //console.log('title', holidayList)
            setHolidayCalender(holidayList)
            setHolidayTitles(titles)

        }


    }, [pageDetails])
    return (
        <>
            <Container sx={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>


                <Typography textAlign={'center'} component={'p'} variant='p' fontSize={20} fontWeight={'bold'}>{pageDetails.pageName}</Typography>
                <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', height: '80%', width: "100%", border: '1px solid gray', m: 2, p: 1, overflow: 'auto' }}>
                    <Grid container spacing={2} display={'flex'} justifyContent={'center'}>


                        {
                            holidayTitles.map((titl, index) => (
                                <Grid item key={index} xs={12} sm={12} md={6} lg={6} >
                                    <Typography textAlign={'center'} component={'p'} variant='p' fontSize={12} fontWeight={'bold'}>{titl}</Typography>
                                    <Box m={1}>
                                        <DataTable size='small' resizableColumns scrollable scrollHeight='350px' showGridlines value={holidayCalender[titl]}
                                            tableStyle={{ minWidth: 'auto', fontSize: "12px" }}>
                                            <Column field="holiday_title" header="Title"></Column>
                                            <Column field="holiday_date" header="Date"></Column>
                                            <Column field="holiday_day" header="Day"></Column>

                                        </DataTable>
                                    </Box>
                                </Grid>

                            ))
                        }
                    </Grid>

                </Box>
            </Container>
        </>

    )
}

export default Holidays