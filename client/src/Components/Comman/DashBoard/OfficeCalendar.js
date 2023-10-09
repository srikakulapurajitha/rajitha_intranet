import * as React from 'react';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import { Grid } from '@mui/material';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Marquee from "react-fast-marquee";
import Divider from '@mui/material/Divider';
//import { Paper } from '@mui/material';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// import Badge from '@mui/material/Badge';
// import { PickersDay } from '@mui/x-date-pickers/PickersDay';
//import CheckIcon from '@mui/icons-material/Check';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './OfficeCalender.css'
import { useState } from 'react';

const holidayList = {7:{'2023-07-05':'07July Dummy'},8:{'2023-08-15':'15Aug: Independance Day','2023-08-30':'30Aug: Rakshabandhan'}}

const convertDateFormat = (date) =>{
  let day = date.getDate()
  if (day < 10){
   day='0'+day
  }
  let month = date.getMonth()+1
  if (month < 10){
   month='0'+month
  }
  return date.getFullYear()+'-'+month+'-'+day
}

export default function OfficeCalender() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()+1)
  const [highlightedDays, setHighlightedDays] = useState(holidayList[currentMonth]);

  const onMonthChange = (m) =>{
    //console.log(m)
    setCurrentMonth(m)
    setHighlightedDays(holidayList[m])
    //console.log(highlightedDays)
  }
  return (
    <Card  sx={{display:'flex',flexDirection:'column', height:390,p:1}}> 
    <Typography variant="p" component="div" sx={{display:'flex',justifyContent:'center',fontSize:20,alignItems:'center'}}>
      Office Calender <CalendarMonthIcon fontSize='8' />
    </Typography>
    <Divider light />
    <Box  sx={{display:'flex',justifyContent:'center',height:370,alignItems:'center'}}>
    <Calendar     
     defaultActiveStartDate={new Date()}
    //  tileContent={({ date}) =>
     
    //  (highlightedDays !== undefined && convertDateFormat(date) in highlightedDays) ? <CheckIcon  fontSize='6' sx={{pb:0.5,color:'green'}}/> : null
    //  }
     //onClickMonth={(value, event) => console.log('Clicked month: ', value)}
     onActiveStartDateChange={({ activeStartDate}) => onMonthChange(activeStartDate.getMonth()+1)} //console.log('Changed view to: ', activeStartDate.getMonth(), view,value)}
     tileClassName={({ date }) => {
       // date will return every date visible on calendar and view will view type (eg. month)
       //console.log(holidayList[currentMonth])
       
      //  const days = new Date('2023-08-15')
      //  console.log(days)
       
       const day = convertDateFormat(date)
       //console.log(currentDate in highlightedDays, currentDate)
       if(highlightedDays !== undefined && day in highlightedDays){
         return 'highlight'; // your class name
        }
      }}
      
      
      
    />
     
    </Box>
    <Divider light />
    <Box sx={{display:'flex',flexDirection:'row',maxWidth:'100%'}}>
    <Typography variant="p" component="div" sx={{fontSize:15,fontWeight:'bold',color:'GrayText',mr:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
      Holidays: 
    </Typography>
    
    <Marquee pauseOnHover={true} direction={'right'} speed={30} style={{maxWidth:'100%'}}>
      {
        
        highlightedDays!==undefined ? Object.values(highlightedDays).map(i=><span key={i} style={{margin:20,fontSize:12,fontFamily:'cursive'}}>{i}</span>) : <span style={{margin:20,fontSize:12,fontFamily:'cursive'}}>No Holidays in this Month</span>
        
     
      }
        
                
    </Marquee>
   
   
    </Box>

    </Card>
  );
}