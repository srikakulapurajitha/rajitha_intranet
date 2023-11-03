import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Marquee from "react-fast-marquee";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './OfficeCalender.css'
import { useState, useEffect } from 'react';
//import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';


export default function OfficeCalender(props) {
  const [selectedMonthYear, setSelectedMonthYearYear] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() })
  const [choosedTitle, setChoosedTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [holidayTitles, setHolidayTitles] = useState([])
  const [highlightedDays, setHighlightedDays] = useState([])
  const [filteredHolidays, setFilteredHolidays] = useState([])
  const [displayHolidays, setDisplayHolidays] = useState([])

  const {data} =props

  const onMonthChange = (m, y) => {
    ////console.log(m, y)
    setSelectedMonthYearYear({ month: m, year: y })
    const monthHolidays = filteredHolidays.filter((holiday) => new Date(holiday.holiday_date).getMonth() === m && new Date(holiday.holiday_date).getFullYear() === y).map(item => ({ ...item, holiday_date: formatDay(item.holiday_date) }))
    setDisplayHolidays(monthHolidays)

  }
  function formatDay(date) {
    date = new Date(date)
    const day = date.getDate();
    const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    if (day >= 11 && day <= 13) {
      return `${day}th ${monthShort}`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st ${monthShort}`;
      case 2:
        return `${day}nd ${monthShort}`;
      case 3:
        return `${day}rd ${monthShort}`;
      default:
        return `${day}th ${monthShort}`;
    }
  }

  useEffect(() => {
    const holidayTitle = []   //title
    data.forEach(i => {
      if (!holidayTitle.includes(i.holidaylist_title)) {
        holidayTitle.push(i.holidaylist_title)
        //
      }
    })
    ////console.log(holidayTitle)
    const holidays = data.filter((items) => items.holidaylist_title === (choosedTitle===''?holidayTitle[0]:choosedTitle)) //filtering holiday list based on first title
    //console.log(holidayTitle,holidays,choosedTitle)
    const holidayDates = holidays.map(item => new Date(item.holiday_date).toLocaleString('en-CA').slice(0, 10))
   
    setHighlightedDays(holidayDates)
    setDisplayHolidays(holidays.filter((holiday) => new Date(holiday.holiday_date).getMonth() === selectedMonthYear.month && new Date(holiday.holiday_date).getFullYear() === selectedMonthYear.year).map(item => ({ ...item, holiday_date: formatDay(item.holiday_date) }))) // on load by current month display holidays
    ////console.log('dibya', holidays)
    setFilteredHolidays(holidays) //filtred holidays
    setHolidayTitles(holidayTitle) // unique titles


  }, [selectedMonthYear, data,choosedTitle])

  const handleHolidayList = useMemo(() => {
    const handleDialogOpen = () => {
      setDialogOpen(!dialogOpen)
      setChoosedTitle('')
    };
    const handleTitleSelect = () => {
      //console.log(choosedTitle)
      const holidays = data.filter((items) => items.holidaylist_title === choosedTitle) //filtering holiday list based on first title
      //console.log('fil:', holidays)
      const holidayDates = holidays.map(item => new Date(item.holiday_date).toLocaleString('en-CA').slice(0, 10))
      setHighlightedDays(holidayDates)
      setDisplayHolidays(holidays.filter((holiday) => new Date(holiday.holiday_date).getMonth() === selectedMonthYear.month && new Date(holiday.holiday_date).getFullYear() === selectedMonthYear.year).map(item => ({ ...item, holiday_date: formatDay(item.holiday_date) }))) // on load by current month display holidays
      setFilteredHolidays(holidays) //filtred holidays
      setDialogOpen(false)
    }


    return (
      <>
        <Dialog disableEscapeKeyDown open={dialogOpen} onClose={handleDialogOpen}>
          <DialogTitle>Select Holiday List Title</DialogTitle>
          <DialogContent sx={{ width: '45ch' }}>
            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <FormControl fullWidth sx={{ m: 1, }}>
                <InputLabel >Select</InputLabel>
                <Select

                  value={choosedTitle}
                  onChange={e => {
                    //console.log(e.target.value)
                    setChoosedTitle(e.target.value)
                  }}
                  label='Select'

                >
                  {holidayTitles.map((holiday) => (
                    <MenuItem key={holiday} value={holiday}>
                      {holiday}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogOpen}>Cancel</Button>
            <Button onClick={handleTitleSelect}>Ok</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }, [choosedTitle, data, dialogOpen, holidayTitles, selectedMonthYear])
  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: 390, p: 1 }}>
        <Typography variant="p" component="div" sx={{ display: 'flex', justifyContent: 'center', fontSize: 20, alignItems: 'center' }}>
          Office Calender<IconButton size='small' onClick={() => setDialogOpen(true)}>
            <CalendarMonthIcon fontSize='8' />
          </IconButton>
        </Typography>
        <Divider light />
        <Box sx={{ display: 'flex', justifyContent: 'center', height: 370, alignItems: 'center' }}>
          <Calendar
            defaultActiveStartDate={new Date()}
            //  tileContent={({ date}) =>
            //  (highlightedDays !== undefined && convertDateFormat(date) in highlightedDays) ? <CheckIcon  fontSize='6' sx={{pb:0.5,color:'green'}}/> : null
            //  }
            //onClickMonth={(value, event) => ////console.log('Clicked month: ', value)}
            onActiveStartDateChange={({ activeStartDate }) => onMonthChange(activeStartDate.getMonth(), activeStartDate.getFullYear())}
            tileClassName={({ date }) => {
              // date will return every date visible on calendar and view will view type (eg. month)
              //////console.log(holidayList[currentMonth])
              //  const days = new Date('2023-08-15')
              //////console.log(date.toLocaleString('en-CA').slice(0,10))

              const day = date.toLocaleString('en-CA').slice(0, 10)

              //////console.log(highlightedDays, day in highlightedDays, day)
              if (highlightedDays.length !== 0 && highlightedDays.includes(day)) {
                return 'highlight'; // your class name
              }

            }}
          />
        </Box>
        <Divider light />
        <Box sx={{ display: 'flex', flexDirection: 'row', maxWidth: '100%' }}>
          <Typography variant="p" component="div" sx={{ fontSize: 15, fontWeight: 'bold', color: 'GrayText', mr: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Holidays:
          </Typography>
          <Marquee pauseOnHover={true} direction={'right'} speed={30} style={{ maxWidth: '100%' }}>
            {
              displayHolidays.length !== 0 ? displayHolidays.map((value, index) => <span key={index} style={{ margin: 20, fontSize: 12, fontFamily: 'cursive' }}>{`${value.holiday_date}: ${value.holiday_title}`}</span>) : <span style={{ margin: 20, fontSize: 12, fontFamily: 'cursive' }}>No Holidays in this Month</span>
            }

          </Marquee>
        </Box>
      </Card>
      {handleHolidayList}
    </>
  );
};