import React, { useContext, useState } from 'react';
import {  Typography, Box, Button, Stack } from '@mui/material';
import TimezoneSelect from 'react-timezone-select';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';



const TimezoneInfo = (props) => {
  const {timezoneInfo,setTimeZoneInfo} = props
  const [prevData, setPrevData] = useState(timezoneInfo)

  const { userDetails } = useContext(UserContext)

  const handleZoneSubmit = () => {
    if (userDetails && prevData !== timezoneInfo) {
      toast.promise(
        axios.post('/api/addtimezoneinformation', { timezone: timezoneInfo, emp_id: userDetails.employee_id }),
        {

          pending: {
            render() {
              return('Adding Fun Information')
            }
          },
          success: {
            render(res) {
              setPrevData(timezoneInfo)
              return(res.data.data)
            }
          },
          error: {
            render(err) {
              return(err.data.response.data)
            }
          }
        }

      )

    }
  };

  return (
    <>
      <Box >
        <Typography variant='h5' component={'h5'} m={1} p={1} textAlign={'center'} gutterBottom > Chat TimeZones Information</Typography>

        <Box sx={{ border: '2px dashed gray', p: 2, width: { xs: '35ch', sm: "40ch", md: '50ch', lg: '60ch' } }}>
          <Stack spacing={1}>
            <Typography>Select Timezone :</Typography>
            <TimezoneSelect
              value={timezoneInfo}
              onChange={e => setTimeZoneInfo(e.value)}
            />

          </Stack>




          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleZoneSubmit}


            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    
    </>
  );
};

export default TimezoneInfo;
