import { TrendingUp } from '@mui/icons-material'
import { Box, Typography, Container, Stepper, Step, StepLabel, StepContent, Collapse, SvgIcon } from '@mui/material'
import React from 'react'

function Experience(props) {
    const { experienceData } = props
    return (
        <>
            <Container sx={{ maxHeight: 'auto', width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <Typography variant='p' component={'h3'} display={'flex'} justifyContent={'center'} alignItems={'center'} m={0.5} textAlign={'center'} >Experience<TrendingUp /></Typography>
                <Box sx={{ width: '100%', height: { xs: '100%', lg: '320px' }, overflow: 'auto', p: 1 }}>
                    <Collapse in={experienceData.length !== 0} unmountOnExit timeout={'auto'} >
                    <Box >
                            <Stepper orientation="vertical" sx={{ mb: 1, }}>
                              {experienceData.map((exp,index) => (
                                <Step active key={exp.promotion_title}>
                                  <StepLabel icon={<SvgIcon><svg fill="#AB7C94"  focusable="false" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"></circle><text x="12" y="12" fill="white" fontSize= "0.75rem" text-anchor="middle" dominant-baseline="central">{experienceData.length-index}</text></svg></SvgIcon>}  optional={<Typography variant="caption">{exp.timerange}</Typography>}><span style={{fontWeight:'bold'}}>{exp.promotion_title} </span> </StepLabel>
                                  <StepContent>
                                    <Typography
                                      sx={{ display: 'inline' }}
                                      component="span"
                                      variant="body1"
                                      color="text.primary"
                                      fontSize={12}
                                      mr={0.5}
                                    >
                                      Roles & Responsibilities:
                                    </Typography>
                                    <span style={{ fontSize: '12px', color: 'gray' }}>{exp.roles_and_responsibility}</span>
                                    
                                  </StepContent>
                                </Step>
                              ))}
                            </Stepper>

                          </Box>
                    </Collapse>
                    {experienceData.length === 0 ?
                        <Box sx={{ maxHeight: '300px', width: '100%', display: 'flex', justifyContent: 'center', }}>
                            <img style={{ objectFit: 'contain', width: '100%', height: 'auto' }} src='exp.png' alt='experience' />
                        </Box>
                        : null
                    }
                </Box>
            </Container>
        </>
    )
}

export default Experience