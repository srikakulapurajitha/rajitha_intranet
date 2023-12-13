import { Container, Typography } from '@mui/material'
import React from 'react'

function Welcome() {
    return (
        <>

            <Container sx={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
                        <img
                            src='https://i.ibb.co/qMBQsK1/welcome-removebg-preview.png'
                            alt='welcome'
                            style={{ height: '100%', width: '300px', maxWidth: '100%',objectFit:'contain' }}
                        />
                        {/* <Typography fontSize={30}>WELCOME</Typography> */}
                    </div>                    
                    <Container sx={{ mt: 2 }}>
                        <Typography variant="p" textAlign={'left'} display="block" fontWeight={'bold'} fontSize={13} >
                        Brightcom Group consolidates Ad-tech, New Media and IoT based businesses across the globe, primarily in the digital eco-system. Our divisions include Brightcom Media, VoloMP, Consumer Products and Dyomo. Brightcom Group?s consumer products division is focused on IoT. Our LIFE product is dedicated to the future of communication and information management in which everyday objects will be connected to the internet, also known as the ?Internet of Things? (IoT).
                        </Typography>
                        <Typography variant="p" textAlign={'left'} mt={2} display="block" fontWeight={'bold'} fontSize={13} >
                        Brightcom Group?s renowned global presence, including in the US, Israel, Latin America ME, Western Europe and Asia Pacific regions, positions us at the forefront of the digital landscape, enabling us to support partners in their efforts to leverage and benefit from current global trends. We have the technological platform and human knowledge to do so. 
                        </Typography>

                        <Typography variant="p" textAlign={'left'} mt={2} display="block" fontWeight={'bold'} fontSize={13} >
                        Our clients include leading blue chip advertisers such as Airtel, British Airways, Coca-Cola, Hyundai Motors, ICICI Bank, ITC, ING, Lenovo, LIC, Maruti Suzuki, MTV, P&G, Qatar Airways, Samsung, Viacom, Sony, Star India, Vodafone, Titan, and Unilever. Publishers include Facebook, LinkedIn, MSN, Twitter, and Yahoo! Brightcom works with agencies like Havas Digital, JWT, Mediacom, Mindshare, Neo@Ogilvy, Ogilvy One, OMD, Satchi&Satchi, TBWA, and ZenithOptiMedia, to name a few.
                        </Typography>
                    </Container>
               
        </Container>



           
        </>

    )
}

export default Welcome