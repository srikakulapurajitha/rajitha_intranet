import React, { useEffect, useState } from 'react'
import Loader from '../Loader'
import { Box, Collapse, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'

import { Add, Remove } from '@mui/icons-material'
import axios from 'axios'
import Address from './Address'
import Charts from './Charts'
import Holidays from './Holidays'
import Welcome from './Welcome'
import { toast } from 'react-toastify'
import AccessNavBar from '../NavBar/AccessNavBar'

function TeamsSection() {

  const [expandedCompany, setExpandedCompany] = useState('');
  const [loader, setLoader] = useState(true)
  const [companyPages, setCompanyPages] = useState([])
  const [companyPageData, setCompanyPageData] = useState({})
  const [holidayPageData, setHolidayPageData] = useState([])
  const [pageDetails, setPageDetails] = useState({ pageName: '', pageType: '', pageData: [] })
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/showcompanypages')


        setCompanies(Array.from(new Set(res.data.map(page => page.company_name))))
        //console.log(Array.from(new Set(res.data.map(page => page.company_name))))

        setCompanyPages(res.data)
        setLoader(false)
      }
      catch(err) {
        setLoader(false)
        toast.error(err.response.data)

      }
    }
    fetchData()

  }, [])

  const handleExpand = (company) => {
    //console.log('expand',company, expandedCompany)
    const selectedCompanyPages = companyPages.filter(data => data.company_name === company)
    //console.log('set',companyPages.filter(data => data.company_name === company).map(d => ({company_pagename:d.company_pagename,company_type:d.company_pagetype})))
    const addr = selectedCompanyPages.filter(page=>page.company_pagetype==='Address')
    const charts = selectedCompanyPages.filter(page=>page.company_pagetype==='Chart')
    const holidays = selectedCompanyPages.filter(page=>page.company_pagetype==='Holidays')
    const holidayPages = Array.from(new Set(holidays.map(p=>p.company_pagename))).map(name=>holidays.filter(p=>p.company_pagename===name)[0])
    setCompanyPageData({addr:addr,charts:charts,holidays:holidayPages})

    setHolidayPageData(holidays)
    
    setExpandedCompany(expandedCompany === company ? '' : company);

  };

  const handlePageSelection = async (page, selectedCompany) => {
    //console.log(page,selectedCompany,holidayPageData.filter(data=>data.company_pagename===page.company_pagename).map(page=>page.id))
    let fetchData;
    if(page.company_pagetype==='Holidays'){
      fetchData ={...page, id:holidayPageData.filter(data=>data.company_pagename===page.company_pagename).map(page=>page.id)}
    }
    else{
      fetchData =page
    }
    
    try {
      const pageData = await axios.post('/api/showcompanypagedata', fetchData)
      //console.log(pageData.data)
      setPageDetails({ pageName: page.company_pagename, pageType: page.company_pagetype, pageData: pageData.data })
    }
    catch(err) {
      toast.error(err.response.data)

    }
    //console.log(x)

  }
  return (
    <>
      <Box sx={{ height: '100vh', width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
        <AccessNavBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 2 }, backgroundColor: '#F5F5F5' }}>
          <div
            style={{
              height: '100%',
              width: '100%',

            }}
          >
            <Grid
              container
              spacing={4}

            >
              <Grid display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} item xs={12} sm={12} lg={3} md={4}>

                <Paper sx={{ width: '100%', minHeight: "80vh", "&:hover": { boxShadow: 10 }, borderRadius: 10, backgroundImage: 'linear-gradient(135deg, #E3FDF5 10%, #FFE6FA 100%);' }}>
                  <Typography textAlign={'center'} fontSize={20} fontWeight={'bold'} pt={1}>Teams</Typography>
                  <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                    <List sx={{ width: '100%' }}>
                      {companies.map((company, index) => (
                        <Box key={index}>
                          <ListItem

                            secondaryAction={
                              <IconButton
                                onClick={() => handleExpand(company)}
                              >

                                {expandedCompany === company ? <Remove color='info' /> : <Add color='info' />}

                              </IconButton>
                            }
                          >

                            <ListItemText primary={company} />
                          </ListItem>
                          <Collapse in={expandedCompany === company} timeout="auto" unmountOnExit>
                            <List dense disablePadding>
                              {Object.keys(companyPageData).map((page, index) => (
                                companyPageData[page].map((data,index)=>(
                                  <ListItemButton
                                  key={index}
                                  onClick={() => handlePageSelection(data, expandedCompany)}
                                >
                                  <ListItem disablePadding style={{ marginLeft: '40px' }}>
                                    <ListItemText primary={`${data.company_pagename} `} />
                                  </ListItem>
                                </ListItemButton>

                                ))
                                
))}

                            </List>



                          </Collapse>
                        </Box>
                      ))}
                    </List>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={9} lg={9}>

                <Paper sx={{ height: "80vh", "&:hover": { boxShadow: 10 }, borderRadius: 10, backgroundImage: 'linear-gradient(135deg, #dfe9f3 10%, #ffffff 100%);' }}>
                  {pageDetails.pageType === 'Address' ? <Address pageDetails={pageDetails} /> : pageDetails.pageType === 'Chart' ? <Charts pageDetails={pageDetails} /> : pageDetails.pageType === 'Holidays' ? <Holidays pageDetails={pageDetails} /> : <Welcome />}
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Box>
      <Loader loader={loader} />

    </>
  )
}

export default TeamsSection