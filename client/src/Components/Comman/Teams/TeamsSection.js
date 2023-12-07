import React, { useContext, useEffect, useState } from 'react'
import Loader from '../Loader'
import { Box, Button, Collapse, Container, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import AdminNavBar from '../NavBar/AdminNavBar'
import UserNavBar from '../NavBar/UserNavBar'
import UserContext from '../../context/UserContext'
import { Add, Remove } from '@mui/icons-material'
import axios from 'axios'
import Address from './Address'

function TeamsSection() {
  const { userDetails } = useContext(UserContext)
  const [expandedCompany, setExpandedCompany] = useState('');
  const [loader, setLoader] = useState(false)
  const [companyPages, setCompanyPages] = useState([])
  const [companyPageData, setCompanyPageData] = useState([])
  const [pageDetails, setPageDetails] = useState({pageName:'',pageType:'',pageData:[]})
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/showcompanypages')

        setCompanies(Array.from(new Set(res.data.map(page => page.company_name))))

        setCompanyPages(res.data)
      }
      catch {

      }
    }
    fetchData()

  }, [])

  const handleExpand = (company) => {
    //console.log(company, expandedCompany)
    setCompanyPageData(Array.from(new Set(companyPages.filter(data => data.company_name === company).map(d => d.company_pagename))))
    setExpandedCompany(expandedCompany === company ? '' : company);

  };

  const handlePageSelection= async(page,selectedCompany)=>{
    console.log(page,selectedCompany)
    const filter = companyPages.filter(data=>data.company_pagename===page&&data.company_name===selectedCompany)
    let fetchData;
    if(filter[0]['company_pagetype']==='Holidays'){
      fetchData = {...filter[0],id:filter.map(data=>data.id)}

    }
    else{
      fetchData=filter[0]
    }
    try{
      const pageData = await axios.post('/api/showcompanypagedata',fetchData)
      console.log(pageData.data)
      setPageDetails({pageName:filter[0].company_pagename,pageType:filter[0].company_pagetype,pageData:pageData.data})
    }
    catch{

    }
    //console.log(x)

  }
  return (
    <>
      <Box sx={{ height: '100vh', width: "auto", display: 'flex', backgroundColor: '#F5F5F5' }}>
        {userDetails.access === 'admin' ? <AdminNavBar /> : <UserNavBar />}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: { xs: 2 }, backgroundColor: '#F5F5F5' }}>
          <div
            style={{
              height: '100%',
              width: '100%',

            }}
          >
            <Grid
              container
              spacing={2}

            >
              <Grid display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} item xs={12} sm={12} lg={3} md={4}>

                <Paper sx={{width:'100%', minHeight: "350px", "&:hover": { boxShadow: 10 }, borderRadius: 10, backgroundImage:'linear-gradient(135deg, #E3FDF5 10%, #FFE6FA 100%);' }}>
                  <Typography textAlign={'center'} fontSize={20} fontWeight={'bold'}  pt={1}>Teams</Typography>
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
                              {companyPageData.map((page, index) => (
                                <ListItemButton
                                key={index}
                                  onClick={() => handlePageSelection(page, expandedCompany)}
                                >
                                  <ListItem disablePadding  style={{ marginLeft: '40px' }}>
                                    <ListItemText primary={`${page} `} />
                                  </ListItem>
                                </ListItemButton>
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
             
              <Paper sx={{ height: "80vh", "&:hover": { boxShadow: 10 }, borderRadius: 10,backgroundImage:'linear-gradient(135deg, #E3FDF5 10%, #FFE6FA 100%);' }}>
                
              {pageDetails.pageType==='Address'?<Address pageDetails={pageDetails} />:null}
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